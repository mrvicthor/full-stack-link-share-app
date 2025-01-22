import VerificationCodeType from "../constants/verificationCodeTypes";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import { CreateUserInput } from "../schemas/user.schema";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail";
import { getVerifyEmail } from "../utils/emailTemplate";
import SessionModel from "../models/session.model";

export function generateVerificationCode(length = 6) {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
}
export async function createUser(data: CreateUserInput) {
  const { firstName, lastName, email, password, userAgent } = data;
  const user = await UserModel.create({
    firstName,
    lastName,
    email,
    password,
  });

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    code: generateVerificationCode(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmail(verificationCode.code),
  });

  if (error) {
    console.log(`Error sending email`);
  }

  await SessionModel.create({
    userId: user._id,
    userAgent,
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return await UserModel.findOne({ email });
}
