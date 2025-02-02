"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const auth_controller_1 = require("../controller/auth.controller");
const user_schema_1 = require("../schemas/user.schema");
async function authRoutes(server) {
    server.post("/register", {
        schema: {
            body: (0, user_schema_1.$ref)("createUserSchema"),
            response: {
                201: (0, user_schema_1.$ref)("createUserResponseSchema"),
            },
        },
    }, auth_controller_1.handleCreateUser);
    server.post("/verify-email", auth_controller_1.handleVerify);
    server.post("/login", {
        schema: {
            body: (0, user_schema_1.$ref)("loginSchema"),
            response: {
                200: (0, user_schema_1.$ref)("loginResponseSchema"),
            },
        },
    }, auth_controller_1.handleLogin);
    server.post("/logout", auth_controller_1.handleLogout);
    server.post("/forgot-password", auth_controller_1.handleForgotPassword);
    server.post("/reset-password/:token", auth_controller_1.handleResetPassword);
    server.get("/verify-session", { preHandler: [server.authenticate] }, auth_controller_1.handleUserProfile);
    server.post("/create-profile", { preHandler: [server.authenticate] }, auth_controller_1.handleProfileUpdate);
}
