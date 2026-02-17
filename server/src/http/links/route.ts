import { FastifyInstance } from "fastify";
import { deleteLink } from "./delete";
import { createLink } from "./create-link";
import { getLink } from "./get-link";
import { redirectLink } from "./redirect-link";

export async function routesLink(app: FastifyInstance) {
  app.register(createLink);
  app.register(getLink);
  app.register(deleteLink);
  app.register(redirectLink)
}