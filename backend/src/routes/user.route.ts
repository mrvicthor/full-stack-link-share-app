import { FastifyInstance } from "fastify";
import { handlePreview } from "../controller/user.controller";

export default async function userRoutes(server: FastifyInstance) {
  server.get("/users/:id", handlePreview);
}
