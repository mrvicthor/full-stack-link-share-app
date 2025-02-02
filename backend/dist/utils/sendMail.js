"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToEmail = exports.getFromEmail = exports.sendMail = void 0;
const resend_1 = __importDefault(require("../config/resend"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendMail = async ({ to, subject, text, html }) => await resend_1.default.emails.send({
    from: (0, exports.getFromEmail)(),
    to: (0, exports.getToEmail)(to),
    subject,
    text,
    html,
});
exports.sendMail = sendMail;
const getFromEmail = () => process.env.NODE_ENV === "development"
    ? "onboarding@resend.dev"
    : process.env.EMAIL_SENDER;
exports.getFromEmail = getFromEmail;
const getToEmail = (to) => process.env.NODE_ENV === "development"
    ? "delivered@resend.dev"
    : to;
exports.getToEmail = getToEmail;
