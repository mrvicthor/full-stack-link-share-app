import resend from "../config/resend";
import dotenv from "dotenv";
dotenv.config();

type MailProps = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export const sendMail = async ({ to, subject, text, html }: MailProps) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });

export const getFromEmail = () =>
  (process.env.NODE_ENV as string) === "development"
    ? "onboarding@resend.dev"
    : (process.env.EMAIL_SENDER as string);

export const getToEmail = (to: string) =>
  (process.env.NODE_ENV as string) === "development"
    ? "delivered@resend.dev"
    : to;
