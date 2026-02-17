import { randomUUID } from "crypto";
import { basename, extname } from "path";
import { Readable } from "stream";
import z from "zod";
import { Upload } from "@aws-sdk/lib-storage";
import { r2 } from "./client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const uploadFileToStorageInput = z.object({
  folder: z.enum(['images', 'downloads']).default('images'),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>;

export async function uploadFileToStorage(input: UploadFileToStorageInput) {
  const { folder, fileName, contentType, contentStream } = 
    uploadFileToStorageInput.parse(input);

  const extension = extname(fileName).trim();
  const fileNameWithoutExtension = basename(fileName, extension);

  const sanitizedFileName = fileNameWithoutExtension.replace(/[^a-zA-Z0-9]/g, '');

  const sanitazedFileNameWithExtension = sanitizedFileName.concat(extension);
    
  const uniqueFileName = `${folder}/${randomUUID()}-${sanitazedFileNameWithExtension}`;

  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  });

  await upload.done();

  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET,
      Key: uniqueFileName,
    }),
    { expiresIn: 3600 }
  );

  return {
    key: uniqueFileName,
    url: signedUrl,
  };
}