"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const user_controller_1 = require("../controller/user.controller");
async function userRoutes(server) {
    server.get("/users/:id", user_controller_1.handlePreview);
}
