"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_schema_1 = require("./schemas/user.schema");
const db_1 = __importDefault(require("./config/db"));
const link_route_1 = __importDefault(require("./routes/link.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
dotenv_1.default.config();
exports.server = (0, fastify_1.default)({ logger: true });
exports.server.register(cors_1.default, {
    origin: [process.env.DEVELOPMENT_ORIGIN], // Your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // If you're using cookies/credentials
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
});
exports.server.register(jwt_1.default, {
    secret: process.env.JWT_SECRET_KEY,
    sign: {
        expiresIn: "1h",
    },
    cookie: {
        cookieName: "accessToken",
        signed: false,
    },
});
exports.server.register(cookie_1.default, {
    secret: process.env.COOKIE_SECRET_KEY,
    parseOptions: {
        httpOnly: true,
        secure: false, // true in production
        sameSite: "none",
        path: "/",
    },
});
// can call the auth authenticator anything, e.g authenticate
exports.server.decorate("authenticate", async (request, reply) => {
    try {
        const token = request.cookies.accessToken ||
            request.headers.authorization?.split(" ")[1];
        if (!token) {
            return reply
                .code(401)
                .send({ message: "Authentication token is required" });
        }
        await request.jwtVerify();
    }
    catch (error) {
        return reply
            .code(401)
            .send({ message: "Invalid or expired authentication token" });
    }
});
exports.server.get("/healthcheck", async function () {
    return { status: "OK" };
});
async function start() {
    exports.server.register(db_1.default);
    for (const schema of user_schema_1.userSchemas) {
        exports.server.addSchema(schema);
    }
    exports.server.register(auth_route_1.default, { prefix: "/api/auth" });
    exports.server.register(link_route_1.default, { prefix: "/api" });
    exports.server.register(user_route_1.default, { prefix: "/api" });
    try {
        await exports.server.listen({ port: 8080, host: "0.0.0.0" });
        exports.server.log.info(`Server running at http://localhost:8080 ${process.env.NODE_ENV}`);
    }
    catch (error) {
        exports.server.log.error(error);
        process.exit(1);
    }
}
start();
