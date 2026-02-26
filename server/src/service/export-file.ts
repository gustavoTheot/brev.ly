import { db, pg } from "@/db";
import { urls } from "@/db/schema";
import { uploadFileToStorage } from "@/storage/upload-file";
import { stringify } from "csv-stringify";
import { eq, and, ilike, desc } from "drizzle-orm";
import { PassThrough, Transform } from "node:stream";
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

  const {sql, params} = db
    .select({
      id: urls.id,
      originalUrl: urls.originalUrl,
      shortUrl: urls.shortUrl,
      createdAt: urls.createdAt,
      userCounter: urls.userCounter,
    })
    .from(urls)
    .where(
      and(
        eq(urls.isDeleted, false),
        searchQuery ? ilike(urls.originalUrl, `%${searchQuery}`) : undefined
      )
    )
    .orderBy(desc(urls.createdAt))
    .toSQL();

  const cursor = pg.unsafe(sql, params as string[]).cursor(100)

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
  });

  const uploadToStorageStream = new PassThrough();

  const uploadToStoragePromise = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-links.csv`,
    contentStream: uploadToStorageStream,
  });

  const pipelinePromise = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: any[], _encoding, callback) {
        // O cursor do postgres.js entrega um array de objetos por "fetch"
        for (const chunk of chunks) {
          this.push(chunk);
        }
        callback();
      },
    }),
    csvStream,
    uploadToStorageStream
  );

  const [uploadResult] = await Promise.all([
    uploadToStoragePromise,
    pipelinePromise
  ]);

  return ({ 
    reportUrl: uploadResult.url 
  });
}