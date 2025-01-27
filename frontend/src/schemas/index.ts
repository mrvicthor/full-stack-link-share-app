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
