import { prisma } from "@/lib/prisma";
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

      const link = await prisma.url.update({
        where: { 
          shortUrl,
          isDeleted: false,
        },
        data: {
          userCounter: { increment: 1 },
        },
      });

      const originalUrl = link.originalUrl;
      reply.status(200).send({ originalUrl });
    } catch (error) {
      return reply.status(404).send({ message: "Short URL not found" });
    }
  });
};
