import { FastifyInstance } from "fastify";
import {
  handleCreateUser,
  handleForgotPassword,
  handleLogin,
  handleLogout,
  handleResetPassword,
  handleUserProfile,
  handleVerify,
} from "../controller/auth.controller";
import { $ref } from "../schemas/user.schema";

export default async function authRoutes(server: FastifyInstance) {
  server.post(
    "/register",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    handleCreateUser
  );
  server.post("/verify-email", handleVerify);
  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    handleLogin
  );
  server.post("/logout", handleLogout);
  server.post("/forgot-password", handleForgotPassword);
  server.post("/reset-password/:token", handleResetPassword);
  server.get(
    "/verify-session",
    { preHandler: [server.authenticate] },
    handleUserProfile
  );
}
