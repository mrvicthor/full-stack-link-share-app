import { FastifyInstance } from "fastify";
import {
  handleCreateLink,
  handleGetLinks,
} from "../controller/link.controller";

export default async function linkRoutes(server: FastifyInstance) {
  server.post(
    "/create-link",
    { preHandler: [server.authenticate] },
    handleCreateLink
  );
  server.get("/links", { preHandler: [server.authenticate] }, handleGetLinks);
}
