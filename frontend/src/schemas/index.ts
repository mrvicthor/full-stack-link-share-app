import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      message: "Can't be empty",
    })
    .email({ message: "Can't be empty" }),
  password: z.string({ message: "Please check again" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface User {
  id: string;
  email: string;
  firstName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

const linkSchema = z.object({
  platform: z.string({ message: "Please select a patform to display." }),
  url: z.string({ message: "Can't be empty" }),
});

export type LinkInput = z.infer<typeof linkSchema>;

export const createSchema = z.object({
  links: z.array(linkSchema),
});

export type CreateLinkSchema = z.infer<typeof createSchema>;

export const registerSchema = z
  .object({
    email: z
      .string({ message: "Can't be empty" })
      .email({ message: "Invalid email" }),
    password: z
      .string({ message: "Please check again" })
      .min(8, { message: "Please check again" }),
    confirmPassword: z
      .string({ message: "Please check again" })
      .min(8, { message: "Please check again" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormInput = z.infer<typeof registerSchema>;

export const verifySchema = z.object({
  verifyCode: z.string({ message: "Please check again" }),
});

export type VerifyInput = z.infer<typeof verifySchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Can't be empty" })
    .email({ message: "Invalid email" }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z
      .string({ message: "Please check again" })
      .min(8, { message: "Please check again" }),
    confirmPassword: z
      .string({ message: "Please check again" })
      .min(8, { message: "Please check again" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
