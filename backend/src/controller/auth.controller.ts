import { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateUserInput,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from "../schemas/user.schema";
import UserModel from "../models/user.model";
import {
  createUser,
  findUserByEmail,
  generateVerificationCode,
} from "../service/user.service";
import VerificationCodeModel from "../models/verificationCode.model";
import VerificationCodeType from "../constants/verificationCodeTypes";
import { comparePassword, hashPassword } from "../utils/hash";
import SessionModel from "../models/session.model";
import { server } from "..";
import { getPasswordResetTemplate } from "../utils/emailTemplate";
import { sendMail } from "../utils/sendMail";
import cloudinary from "../config/cloudinary";

interface JWTPayload {
  id: string;
  [key: string]: any;
}

const DEVELOPMENT_ORIGIN = process.env.DEVELOPMENT_ORIGIN as string;
const secure = process.env.NODE_ENV !== "development";
export const handleCreateUser = async (
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) => {
  const result = { ...request.body, userAgent: request.headers["user-agent"] };

  const existingUser = await findUserByEmail(result.email);
  if (existingUser) {
    return reply.code(409).send({
      message: "User already exist",
    });
  }
  const user = await createUser(result);

  return reply.code(201).send(user);
};

export const handleVerify = async (
  request: FastifyRequest<{ Body: { verifyCode: string } }>,
  reply: FastifyReply
) => {
  const { verifyCode } = request.body;
  const validCode = await VerificationCodeModel.findOne({
    code: verifyCode,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  if (!validCode) {
    return reply.code(409).send({
      message: "Invalid or expired verification code",
    });
  }
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      isVerified: true,
    },
    { new: true }
  );
  if (!updatedUser) {
    return reply.code(500).send({ message: "Failed to verify email" });
  }
  await validCode.deleteOne();
  return reply.code(200).send({ message: "Account verified successfully" });
};

export const handleLogin = async (
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) => {
  const result = { ...request.body, userAgent: request.headers["user-agent"] };
  const user = await findUserByEmail(result.email);
  if (!user) {
    return reply.code(401).send({ message: "Invalid email or password" });
  }
  const isValid = await comparePassword(result.password, user.password);

  if (!isValid) {
    return reply.code(401).send({ message: "Invalid email or password" });
  }
  const userId = user._id;

  await SessionModel.create({
    userId,
    userAgent: result.userAgent,
  });

  const payload = {
    id: userId,
    email: user.email,
    firstName: user.firstName,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const accessToken = server.jwt.sign(payload);
  const refreshToken = server.jwt.sign({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
  });
  return reply
    .setCookie("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      secure,
      sameSite: "none",
      maxAge: 3600,
    })
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure,
      sameSite: "none",
      maxAge: 7 * 24 * 3600,
    })
    .code(200)
    .send({ accessToken });
};

export const handleLogout = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const session = request.cookies.accessToken as string;
  const payload = server.jwt.verify(session);

  if (payload) {
    const { id } = payload as JWTPayload;
    await SessionModel.findByIdAndDelete(id);
  }
  const isProduction = process.env.NODE_ENV === "production";
  return reply
    .clearCookie("accessToken", {
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: "none",
    })
    .code(200)
    .send({ message: "Logout successful" });
};

export const handleForgotPassword = async (
  request: FastifyRequest<{ Body: ForgotPasswordInput }>,
  reply: FastifyReply
) => {
  const { email } = request.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return reply.code(403).send({ message: "User does not exist" });
  }
  const existingCode = await VerificationCodeModel.findOne({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });

  if (existingCode) {
    const remainingTime = Math.ceil(
      (existingCode.expiresAt.getTime() - Date.now()) / (60 * 1000)
    );

    return reply.code(429).send({
      message: `You can request a new password reset link in ${remainingTime} minutes.`,
    });
  }

  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
  const validCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    code: generateVerificationCode(),
    expiresAt,
  });

  const url = `${DEVELOPMENT_ORIGIN}/password/reset?code=${
    validCode._id
  }&exp=${expiresAt.getTime()}`;

  const { error } = await sendMail({
    to: user.email,
    ...getPasswordResetTemplate(user.firstName, url),
  });

  if (error) {
    return reply.code(500).send({ message: `Failed to send email ${error}` });
  }
  return reply.code(200).send({ message: "Success" });
};

export const handleResetPassword = async (
  request: FastifyRequest<{
    Body: ResetPasswordInput;
    Params: { token: string };
  }>,
  reply: FastifyReply
) => {
  const { password } = request.body;
  const validCode = await VerificationCodeModel.findOne({
    _id: request.params.token,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  if (!validCode) {
    return reply.code(400).send({ message: "Invalid or expired token" });
  }
  const hashedPassword = await hashPassword(password);
  const updatedUser = await UserModel.findOneAndUpdate(validCode.userId, {
    password: hashedPassword,
  });
  await validCode.deleteOne();
  await SessionModel.deleteMany({
    userId: updatedUser?._id,
  });
  return reply.code(200).send({ message: "Password reset successful" });
};

export const handleUserProfile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply.code(401).send({ message: "User not authenticated" });
    }
    return reply.code(200).send({ isAuth: true, user: request.user });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: "Internal server error" });
  }
};

export const handleRefreshToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const refreshToken = request.cookies.refreshToken as string;
    if (!refreshToken) {
      return reply.code(401).send({ message: "Refresh token required" });
    }
    const decoded: JWTPayload = server.jwt.verify(refreshToken);
    const user = await UserModel.findById(decoded.id);
    if (!user) return reply.code(401).send({ message: "User not found" });
    const payload = {
      id: user._id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    const accessToken = server.jwt.sign(payload);
    const newRefreshToken = server.jwt.sign({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    });

    return reply
      .setCookie("accessToken", accessToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 3600,
      })
      .setCookie("refreshToken", newRefreshToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60, // 1 hour
      })
      .code(200)
      .send({
        accessToken,
        user: {
          id: user._id,
          email: user.email,
        },
      });
  } catch (error) {
    request.log.error(error);
    return reply.code(401).send({ message: "Invalid refresh token" });
  }
};

export const handleProfileUpdate = async (
  request: FastifyRequest<{ Body: UpdateProfileInput }>,
  reply: FastifyReply
) => {
  const {
    "First Name": firstName,
    "Last Name": lastName,
    Email: email,
    imageUrl,
  } = request.body;

  const userId = request.user.id;
  const existingUser = await UserModel.findById(userId);
  if (!existingUser) {
    return reply.code(403).send({ message: "User does not exist" });
  }
  let image = null;
  const imageStringCheck = "https://res.cloudinary.com/mrvicthor/image/upload/";

  if (imageUrl && imageUrl.includes(imageStringCheck) === false) {
    const base64Data = imageUrl.split(",")[1];
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Data}`,
      {
        folder: "link-sharing",
      }
    );

    image = result.secure_url;
  } else {
    image = imageUrl;
  }

  await UserModel.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      email,
      image,
    },
    { new: true }
  );

  return reply.code(200).send({ message: "Profile successfully updated" });
};
