import { exportFile } from "@/service/export-file";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const exportCSV: FastifyPluginAsyncZod = async (server) => {
  server.post('/uploads/export-csv', {
    schema: {
      summary: "Export links as CSV",
      tags: ["links"],
      querystring: z.object({
        searchQuery: z.string().optional()
      }),
      response: { 
        200: z.object({
          reportUrl: z.string().url()
        }),
        500: z.object({
          message: z.string()
        })
      }
    },
  },
  async (request, reply) => {
    try {
      const { searchQuery } = request.query;

      const result = await exportFile({
        searchQuery,
      });

      return reply.status(200).send(result);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      return reply.status(500).send({ message: "Failed to export CSV" });
    }
  })
};