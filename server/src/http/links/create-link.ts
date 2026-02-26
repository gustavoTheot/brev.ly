import { checkCharacters } from "@/helper/check-characters";
import { db } from "@/db";
import { urls } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

// criar um link
export const createLink: FastifyPluginAsyncZod = async (server) => {
  server.post('/link', 
    {
      schema: {
        summary: "Create a new short link",
        tags: ["links"],
        body: z.object({
          originUrl: z.string().url(),
          shortUrl: z.string(),
        }).describe("Data to create a new short link"),

        response: {
          200: z.object({
            id: z.string(),
            originalUrl: z.string().url(),
            shortUrl: z.string(),
            userCounter: z.number(),
          }).describe("The created short link"),
          400: z.object({ message: z.string() }).describe("Bad Request"),
        }
      }
    },
    async (request, reply) => 
  {
    const { originUrl, shortUrl } = request.body;

    if (shortUrl) {
      const [existingLink] = await db
        .select()
        .from(urls)
        .where(eq(urls.shortUrl, shortUrl))
        .limit(1);

      if (existingLink) {
        return reply.status(400).send({ message: "Short URL already exists" });
      }

      if (!checkCharacters(shortUrl)) {
        return reply.status(400).send({ message: "Short URL can only contain letters, numbers, and hyphens" });
      }
    }

    const [newLink] = await db
      .insert(urls)
      .values({ originalUrl: originUrl, shortUrl })
      .returning();

    return reply.send(newLink);
  });
}