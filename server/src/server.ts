
import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import { routesLink } from "./http/links/route";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { exportFileRoute } from "./http/export/route";
import fastifyMultipart from "@fastify/multipart";

const app = fastify();

app.register(fastifyMultipart)
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
});

app.get('/ping', async () => {
  return { status: 'ok' };
});

app.register(routesLink);
app.register(exportFileRoute);

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Servidor rodando na porta 3000');
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start();