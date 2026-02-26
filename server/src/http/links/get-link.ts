import { db } from "@/db";
import { urls } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
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

    const [link] = await db
      .select()
      .from(urls)
      .where(and(eq(urls.id, id), eq(urls.isDeleted, false)))
      .limit(1);
    
    return reply.send(link ?? null);
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
    const links = await db
      .select()
      .from(urls)
      .where(eq(urls.isDeleted, false))
      .orderBy(desc(urls.createdAt));

    return reply.send(links);
  });
}