import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import { getBaseUrl } from "./url";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const secure = process.env.SMTP_SECURE === "true"; // true for 465
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!host || !user || !pass) {
    // Fail fast and loudly - app should not silently attempt to connect to localhost
    throw new Error(
        "SMTP configuration missing. Please set SMTP_HOST, SMTP_USER and SMTP_PASS in your .env"
    );
}

/**
 * Create a nodemailer transporter.
 * Accepts optional overrides (useful for tests e.g., pointing to MailHog).
 */
export function createTransporter(overrides?: {
    host?: string; port?: number; secure?: boolean; user?: string; pass?: string;
}) {
    const cfgHost = overrides?.host ?? process.env.SMTP_HOST;
    const cfgPort = overrides?.port ?? (process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587);
    const cfgSecure = typeof overrides?.secure === "boolean"
        ? overrides!.secure
        : (cfgPort === 465);

    const transporter = nodemailer.createTransport({
        host: cfgHost,
        port: cfgPort,
        secure: cfgSecure,
        auth: {
            user: overrides?.user ?? process.env.SMTP_USER,
            pass: overrides?.pass ?? process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: process.env.NODE_ENV === "production",
        },
        logger: process.env.NODE_ENV !== "production",
        debug: process.env.NODE_ENV !== "production",
    });

    // print config (avoid printing secrets in shared logs)
    console.log("Transport config:", { host: cfgHost, port: cfgPort, secure: cfgSecure });

    return transporter;
}

// default transporter for app usage
export const transporter = createTransporter();

/**
 * Example helper to send verification email.
 * Keeps our app-level functionality in this module.
 */
export async function sendVerificationEmail(to: string, token: string) {
    const baseUrl = getBaseUrl();
    const confirmUrl = `${baseUrl}/api/auth/confirm?token=${encodeURIComponent(
        token
    )}`;

    const mailOptions = {
        from:
            process.env.EMAIL_FROM ||
            `no-reply@${new URL(baseUrl).hostname}`,
        to,
        subject: "Confirm your email",
        html: `
      <p>Thanks for registering. Click the link below to confirm your email and activate your account:</p>
      <p><a href="${confirmUrl}">Confirm email</a></p>
      <p>If you did not register, ignore this email.</p>
    `,
        text: `Confirm your email: ${confirmUrl}`,
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Send password reset email
 */
export async function sendResetPasswordEmail(to: string, token: string) {
    const baseUrl = getBaseUrl();
    const resetUrl = `${baseUrl}/auth/reset?token=${encodeURIComponent(
        token
    )}`;

    const mailOptions = {
        from:
            process.env.EMAIL_FROM ||
            `no-reply@${new URL(baseUrl).hostname}`,
        to,
        subject: "Reset your password",
        html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `,
        text: `Reset your password: ${resetUrl}`,
    };

    return transporter.sendMail(mailOptions);
}
