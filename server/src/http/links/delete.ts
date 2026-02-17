import { prisma } from "@/lib/prisma";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteLink: FastifyPluginAsyncZod = async (server) => {
  server.delete('/link/:id', 
    {
      schema: {
        summary: "Delete a short link",
        tags: ["links"],
        params: z.object({
          id: z.string().describe("ID of the short link to delete"),
        }).describe("Parameters to delete a short link"),
      }
    },
    async (request, reply) => 
  {
    const { id } = request.params;

    // Delete logic
    await prisma.url.update({
      where: { id },
      data: { isDeleted: true },
    });

    return reply.status(204).send();
  });
};

