import { FastifyInstance } from "fastify";
import { exportCSV } from "./export-csv";

export function exportFileRoute(app: FastifyInstance) {
  app.register(exportCSV)
}