import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

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
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
        throw new Error("NEXT_PUBLIC_BASE_URL is required for verification link generation.");
    }

    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/confirm?token=${encodeURIComponent(
        token
    )}`;

    const mailOptions = {
        from:
            process.env.EMAIL_FROM ||
            `no-reply@${new URL(process.env.NEXT_PUBLIC_BASE_URL!).hostname}`,
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
