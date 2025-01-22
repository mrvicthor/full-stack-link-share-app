import bcrypt from "bcrypt";

export const hashPassword = async (value: string, saltRound?: number) =>
  bcrypt.hash(value, saltRound || 10);

export const comparePassword = async (value: string, hash: string) =>
  bcrypt.compare(value, hash).catch(() => false);
