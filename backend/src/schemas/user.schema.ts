import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  userAgent: z.string().optional(),
};

const createUserSchema = z
  .object({
    ...userCore,
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
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

const createUserResponseSchema = z.object({
  _id: z.string(),
  ...userCore,
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string(),
  userAgent: z.string().optional(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
});

const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

const resetPasswordSchema = z.object({
  password: z.string(),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

const linkSchema = z.object({
  platform: z.string({ message: "Please select a patform to display." }),
  url: z.string({ message: "Can't be empty" }),
});

export type CreateLinkInput = z.infer<typeof linkSchema>;
export type LinkProps = z.infer<typeof linkSchema>;
