import { prisma } from "@/lib/prisma";
import { uploadFileToStorage } from "@/storage/upload-file";
import { stringify } from "csv-stringify";
import { PassThrough, Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import z from "zod";

const exportUploadsInput = z.object({
  searchQuery: z.string().optional(),
});

type ExportUploadsInput = z.infer<typeof exportUploadsInput>;

type ExportUploadsOutput = {
  reportUrl: string;
}

export async function exportFile(
  input: ExportUploadsInput
): Promise<ExportUploadsOutput> {
  const { searchQuery } = exportUploadsInput.parse(input);

  const where = searchQuery ? {
    originalUrl: {
      contains: searchQuery,
    },
  } : {};

  const dbStream = Readable.from(async function* () {
    const BATCH_SIZE = 500;
    let cursor: string | undefined = undefined;

    while (true) {
      const batch = await prisma.url.findMany({
        take: BATCH_SIZE,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...where,
          isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          originalUrl: true,
          shortUrl: true,
          createdAt: true,
          userCounter: true
        }
      });

      if (batch.length === 0) break;

      for (const item of batch) {
        yield item;
      }

      cursor = batch[batch.length - 1].id;

      if (batch.length < BATCH_SIZE) break;
    }
  }());

  const csvStream = stringify({
    delimiter: ',',
    header: true,
   columns: [
      { key: "originalUrl", header: "Original URL" },
      { key: "shortUrl", header: "Short Code" },
      { key: "userCounter", header: "Clicks" },
      { key: "createdAt", header: "Created At" },
    ],
    cast: {
      date: (date) => date.toISOString(),
    }
  })

  const uploadPassThrough = new PassThrough();

  const randomFileName = `${new Date().toISOString()}-links.csv`;

  const uploadToStoragePromise = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: randomFileName,
    contentStream: uploadPassThrough,
  });

  const pipelinePromise = pipeline(
    dbStream,
    csvStream,
    uploadPassThrough
  );

  const [uploadResult] = await Promise.all([
    uploadToStoragePromise,
    pipelinePromise
  ]);

  return { 
    reportUrl: uploadResult.url 
  };
}