"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = linkRoutes;
const link_controller_1 = require("../controller/link.controller");
async function linkRoutes(server) {
    server.post("/create-link", { preHandler: [server.authenticate] }, link_controller_1.handleCreateLink);
    server.get("/links", { preHandler: [server.authenticate] }, link_controller_1.handleGetLinks);
    server.delete("/links/:id", { preHandler: [server.authenticate] }, link_controller_1.handleDeleteLink);
    server.put("/links/:id", { preHandler: [server.authenticate] }, link_controller_1.handleUpdateLink);
}
