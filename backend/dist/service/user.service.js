"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = generateVerificationCode;
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
const user_model_1 = __importDefault(require("../models/user.model"));
const verificationCode_model_1 = __importDefault(require("../models/verificationCode.model"));
const crypto_1 = __importDefault(require("crypto"));
const sendMail_1 = require("../utils/sendMail");
const emailTemplate_1 = require("../utils/emailTemplate");
const session_model_1 = __importDefault(require("../models/session.model"));
function generateVerificationCode(length = 6) {
    return crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
}
async function createUser(data) {
    const { email, password, userAgent } = data;
    const user = await user_model_1.default.create({
        email,
        password,
    });
    const verificationCode = await verificationCode_model_1.default.create({
        userId: user._id,
        type: "email_verification" /* VerificationCodeType.EmailVerification */,
        code: generateVerificationCode(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
    const { error } = await (0, sendMail_1.sendMail)({
        to: user.email,
        ...(0, emailTemplate_1.getVerifyEmail)(verificationCode.code),
    });
    if (error) {
        console.log(`Error sending email`);
    }
    await session_model_1.default.create({
        userId: user._id,
        userAgent,
    });
    return user;
}
async function findUserByEmail(email) {
    return await user_model_1.default.findOne({ email });
}
