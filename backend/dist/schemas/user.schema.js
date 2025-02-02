"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ref = exports.userSchemas = void 0;
const fastify_zod_1 = require("fastify-zod");
const zod_1 = require("zod");
const userCore = {
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .email(),
    userAgent: zod_1.z.string().optional(),
};
const createUserSchema = zod_1.z
    .object({
    ...userCore,
    password: zod_1.z
        .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    })
        .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: zod_1.z
        .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    })
        .min(8, { message: "Password must be at least 8 characters" }),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
const createUserResponseSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    ...userCore,
});
const loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .email(),
    password: zod_1.z.string(),
    userAgent: zod_1.z.string().optional(),
});
const loginResponseSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
});
_a = (0, fastify_zod_1.buildJsonSchemas)({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
}), exports.userSchemas = _a.schemas, exports.$ref = _a.$ref;
const forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .email(),
});
const resetPasswordSchema = zod_1.z.object({
    password: zod_1.z.string(),
});
const linkSchema = zod_1.z.object({
    platform: zod_1.z.string({ message: "Please select a patform to display." }),
    url: zod_1.z.string({ message: "Can't be empty" }),
});
const profileUpdateSchema = zod_1.z.object({
    "First Name": zod_1.z.string().min(3),
    "Last Name": zod_1.z.string().min(3),
    Email: zod_1.z.string().email(),
    imageUrl: zod_1.z.string(),
});
