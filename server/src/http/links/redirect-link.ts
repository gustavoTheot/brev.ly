import { db } from "@/db";
import { urls } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const redirectLink: FastifyPluginAsyncZod = async (server) => {
  server.get('/redirect/:shortUrl', 
    {
      schema: {
        summary: "Redirect to original URL by short URL",
        tags: ["links"],
        params: z.object({
          shortUrl: z.string().describe("Short URL to redirect"),
        }).describe("Parameters to redirect to original URL"),

        response: {
          200: z.object({
            originalUrl: z.string().url(),
          }),
          404: z.object({
            message: z.string().describe("Error message when short URL is not found"),
          }).describe("Response when short URL is not found"),
        }
      }
    },
  async (request, reply) => {
    try {
      const { shortUrl } = request.params;

      // incrementa a quantidade de acessos e retorna o link
      const [link] = await db
        .update(urls)
        .set({ userCounter: sql`${urls.userCounter} + 1` })
        .where(and(eq(urls.shortUrl, shortUrl), eq(urls.isDeleted, false)))
        .returning();

      if (!link) {
        return reply.status(404).send({ message: "Short URL not found" });
      }

      // obter a URL original por meio de uma URL encurtada
      reply.status(200).send({ originalUrl: link.originalUrl });
    } catch (error) {
      return reply.status(404).send({ message: "Short URL not found" });
    }
  });
};
