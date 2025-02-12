import fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import fastifyCors from "@fastify/cors";
import fjwt from "@fastify/jwt";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";
import authRoutes from "./routes/auth.route";
import { userSchemas } from "./schemas/user.schema";
import dbConnector from "./config/db";
import linkRoutes from "./routes/link.route";
import userRoutes from "./routes/user.route";

dotenv.config();

export const server = fastify({ logger: true });

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      firstName: string;
      iat: Date;
      exp: Date;
    };
  }
}

server.register(fastifyCors, {
  origin: "*", // Your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // If you're using cookies/credentials
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
});

server.register(fjwt, {
  secret: process.env.JWT_SECRET_KEY as string,
  sign: {
    expiresIn: "1h",
  },
  cookie: {
    cookieName: "accessToken",
    signed: false,
  },
});

server.register(cookie, {
  secret: process.env.COOKIE_SECRET_KEY as string,
  parseOptions: {
    httpOnly: true,
    secure: true, // true in production
    sameSite: "none",
  },
} as FastifyCookieOptions);
// can call the auth authenticator anything, e.g authenticate
server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token =
        request.cookies.accessToken ||
        request.headers.authorization?.split(" ")[1];
      if (!token) {
        return reply
          .code(401)
          .send({ message: "Authentication token is required" });
      }
      await request.jwtVerify();
    } catch (error) {
      return reply
        .code(401)
        .send({ message: "Invalid or expired authentication token" });
    }
  }
);

server.get("/healthcheck", async function () {
  return { status: "OK" };
});

async function start() {
  server.register(dbConnector);
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }
  server.register(authRoutes, { prefix: "/api/auth" });
  server.register(linkRoutes, { prefix: "/api" });
  server.register(userRoutes, { prefix: "/api" });

  try {
    await server.listen({ port: 8080, host: "0.0.0.0" });
    server.log.info(
      `Server running at http://localhost:8080 ${process.env.NODE_ENV}`
    );
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

start();
