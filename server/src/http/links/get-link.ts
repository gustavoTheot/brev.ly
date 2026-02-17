import { prisma } from "@/lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const getLink: FastifyPluginAsyncZod = async (server) => {
  server.get('/link/:id', 
    {
      schema: {
        summary: "Get original URL by short link ID",
        tags: ["links"],
        params: z.object({
          id: z.string().describe("ID of the short link"),
        }).describe("Parameters to retrieve the original URL"),
      }
    }, 
    async (request, reply) => 
  {
    const { id } = request.params;

    const links = await prisma.url.findUnique({
      where: { 
        id,
        isDeleted: false,
      },
    });
    
    return reply.send(links);
  });

  server.get('/link', 
    {
      schema: {
        summary: "Get all short links",
        tags: ["links"],
      }
    }, 
    async (request, reply) => 
  {
    const links = await prisma.url.findMany({
      where: {
        isDeleted: false,
      }, 
      orderBy: {
        createdAt: 'desc',
      }
    });
    return reply.send(links);
  });
}