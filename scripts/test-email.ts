import dotenv from "dotenv";
dotenv.config();

import { createTransporter } from "../lib/email";

async function runTest() {
    console.log("Testing SMTP connection...");

    // Optionally override for local dev (uncomment to test with MailHog)
    // const t = createTransporter({ host: "127.0.0.1", port: 1025, secure: false });

    // Use the app transporter by default
    const t = createTransporter();

    try {
        await t.verify();
        console.log("✅ SMTP connection verified successfully.");
    } catch (err) {
        console.error("❌ SMTP connection failed:", err);
        process.exit(1);
    }

    const testRecipient = process.env.SMTP_USER || process.env.TO_EMAIL;
    if (!testRecipient) {
        console.warn("⚠️ No recipient configured (SMTP_USER or TO_EMAIL). Skipping send test.");
        return;
    }

    try {
        const info = await t.sendMail({
            from: process.env.EMAIL_FROM || process.env.SMTP_USER,
            to: testRecipient,
            subject: "Test Email from Resume Builder",
            text: "If you are reading this, your email configuration is working correctly.",
        });
        console.log("✅ Email sent successfully. messageId:", info.messageId);
    } catch (err) {
        console.error("❌ Failed to send email:", err);
        process.exit(1);
    }
}

runTest();
