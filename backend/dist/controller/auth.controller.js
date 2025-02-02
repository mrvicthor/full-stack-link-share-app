"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleProfileUpdate = exports.handleRefreshToken = exports.handleUserProfile = exports.handleResetPassword = exports.handleForgotPassword = exports.handleLogout = exports.handleLogin = exports.handleVerify = exports.handleCreateUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const user_service_1 = require("../service/user.service");
const verificationCode_model_1 = __importDefault(require("../models/verificationCode.model"));
const hash_1 = require("../utils/hash");
const session_model_1 = __importDefault(require("../models/session.model"));
const __1 = require("..");
const emailTemplate_1 = require("../utils/emailTemplate");
const sendMail_1 = require("../utils/sendMail");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const DEVELOPMENT_ORIGIN = process.env.NODE_ENV;
const secure = process.env.NODE_ENV !== "development";
const handleCreateUser = async (request, reply) => {
    const result = { ...request.body, userAgent: request.headers["user-agent"] };
    const existingUser = await (0, user_service_1.findUserByEmail)(result.email);
    if (existingUser) {
        return reply.code(409).send({
            message: "User already exist",
        });
    }
    const user = await (0, user_service_1.createUser)(result);
    return reply.code(201).send(user);
};
exports.handleCreateUser = handleCreateUser;
const handleVerify = async (request, reply) => {
    const { verifyCode } = request.body;
    const validCode = await verificationCode_model_1.default.findOne({
        code: verifyCode,
        type: "email_verification" /* VerificationCodeType.EmailVerification */,
        expiresAt: { $gt: new Date() },
    });
    if (!validCode) {
        return reply.code(409).send({
            message: "Invalid or expired verification code",
        });
    }
    const updatedUser = await user_model_1.default.findByIdAndUpdate(validCode.userId, {
        isVerified: true,
    }, { new: true });
    if (!updatedUser) {
        return reply.code(500).send({ message: "Failed to verify email" });
    }
    await validCode.deleteOne();
    return reply.code(200).send({ message: "Account verified successfully" });
};
exports.handleVerify = handleVerify;
const handleLogin = async (request, reply) => {
    const result = { ...request.body, userAgent: request.headers["user-agent"] };
    const user = await (0, user_service_1.findUserByEmail)(result.email);
    if (!user) {
        return reply.code(401).send({ message: "Invalid email or password" });
    }
    const isValid = await (0, hash_1.comparePassword)(result.password, user.password);
    if (!isValid) {
        return reply.code(401).send({ message: "Invalid email or password" });
    }
    const userId = user._id;
    await session_model_1.default.create({
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
    const accessToken = __1.server.jwt.sign(payload);
    const refreshToken = __1.server.jwt.sign({
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
exports.handleLogin = handleLogin;
const handleLogout = async (request, reply) => {
    const session = request.cookies.accessToken;
    const payload = __1.server.jwt.verify(session);
    if (payload) {
        const { id } = payload;
        await session_model_1.default.findByIdAndDelete(id);
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
exports.handleLogout = handleLogout;
const handleForgotPassword = async (request, reply) => {
    const { email } = request.body;
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        return reply.code(403).send({ message: "User does not exist" });
    }
    const existingCode = await verificationCode_model_1.default.findOne({
        userId: user._id,
        type: "password_reset" /* VerificationCodeType.PasswordReset */,
        expiresAt: { $gt: new Date() },
    });
    if (existingCode) {
        const remainingTime = Math.ceil((existingCode.expiresAt.getTime() - Date.now()) / (60 * 1000));
        return reply.code(429).send({
            message: `You can request a new password reset link in ${remainingTime} minutes.`,
        });
    }
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const validCode = await verificationCode_model_1.default.create({
        userId: user._id,
        type: "password_reset" /* VerificationCodeType.PasswordReset */,
        code: (0, user_service_1.generateVerificationCode)(),
        expiresAt,
    });
    const url = `${DEVELOPMENT_ORIGIN}/password/reset?code=${validCode._id}&exp=${expiresAt.getTime()}`;
    const { error } = await (0, sendMail_1.sendMail)({
        to: user.email,
        ...(0, emailTemplate_1.getPasswordResetTemplate)(user.firstName, url),
    });
    if (error) {
        return reply.code(500).send({ message: `Failed to send email ${error}` });
    }
    return reply.code(200).send({ message: "Success" });
};
exports.handleForgotPassword = handleForgotPassword;
const handleResetPassword = async (request, reply) => {
    const { password } = request.body;
    const validCode = await verificationCode_model_1.default.findOne({
        _id: request.params.token,
        type: "password_reset" /* VerificationCodeType.PasswordReset */,
        expiresAt: { $gt: new Date() },
    });
    if (!validCode) {
        return reply.code(400).send({ message: "Invalid or expired token" });
    }
    const hashedPassword = await (0, hash_1.hashPassword)(password);
    const updatedUser = await user_model_1.default.findOneAndUpdate(validCode.userId, {
        password: hashedPassword,
    });
    await validCode.deleteOne();
    await session_model_1.default.deleteMany({
        userId: updatedUser?._id,
    });
    return reply.code(200).send({ message: "Password reset successful" });
};
exports.handleResetPassword = handleResetPassword;
const handleUserProfile = async (request, reply) => {
    try {
        if (!request.user) {
            return reply.code(401).send({ message: "User not authenticated" });
        }
        return reply.code(200).send({ isAuth: true, user: request.user });
    }
    catch (error) {
        request.log.error(error);
        return reply.code(500).send({ message: "Internal server error" });
    }
};
exports.handleUserProfile = handleUserProfile;
const handleRefreshToken = async (request, reply) => {
    try {
        const refreshToken = request.cookies.refreshToken;
        if (!refreshToken) {
            return reply.code(401).send({ message: "Refresh token required" });
        }
        const decoded = __1.server.jwt.verify(refreshToken);
        const user = await user_model_1.default.findById(decoded.id);
        if (!user)
            return reply.code(401).send({ message: "User not found" });
        const payload = {
            id: user._id,
            email: user.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        };
        const accessToken = __1.server.jwt.sign(payload);
        const newRefreshToken = __1.server.jwt.sign({
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
    }
    catch (error) {
        request.log.error(error);
        return reply.code(401).send({ message: "Invalid refresh token" });
    }
};
exports.handleRefreshToken = handleRefreshToken;
const handleProfileUpdate = async (request, reply) => {
    const { "First Name": firstName, "Last Name": lastName, Email: email, imageUrl, } = request.body;
    const userId = request.user.id;
    const existingUser = await user_model_1.default.findById(userId);
    if (!existingUser) {
        return reply.code(403).send({ message: "User does not exist" });
    }
    let image = null;
    const imageStringCheck = "https://res.cloudinary.com/mrvicthor/image/upload/";
    if (imageUrl && imageUrl.includes(imageStringCheck) === false) {
        const base64Data = imageUrl.split(",")[1];
        const result = await cloudinary_1.default.uploader.upload(`data:image/png;base64,${base64Data}`, {
            folder: "link-sharing",
        });
        image = result.secure_url;
    }
    else {
        image = imageUrl;
    }
    await user_model_1.default.findByIdAndUpdate(userId, {
        firstName,
        lastName,
        email,
        image,
    }, { new: true });
    return reply.code(200).send({ message: "Profile successfully updated" });
};
exports.handleProfileUpdate = handleProfileUpdate;
