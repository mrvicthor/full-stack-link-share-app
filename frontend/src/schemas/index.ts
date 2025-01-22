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
