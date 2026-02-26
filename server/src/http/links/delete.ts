import { db } from "@/db";
import { urls } from "@/db/schema";
import { eq } from "drizzle-orm";
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

    await db
      .update(urls)
      .set({ isDeleted: true })
      .where(eq(urls.id, id));

    return reply.status(204).send();
  });
};

