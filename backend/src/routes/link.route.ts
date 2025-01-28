import { FastifyInstance } from "fastify";
import {
  handleCreateLink,
  handleDeleteLink,
  handleGetLinks,
  handleUpdateLink,
} from "../controller/link.controller";

export default async function linkRoutes(server: FastifyInstance) {
  server.post(
    "/create-link",
    { preHandler: [server.authenticate] },
    handleCreateLink
  );
  server.get("/links", { preHandler: [server.authenticate] }, handleGetLinks);
  server.delete(
    "/links/:id",
    { preHandler: [server.authenticate] },
    handleDeleteLink
  );
  server.put(
    "/links/:id",
    { preHandler: [server.authenticate] },
    handleUpdateLink
  );
}
