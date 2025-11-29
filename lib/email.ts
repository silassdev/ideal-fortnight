import nodemailer from 'nodemailer';

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(to: string, token: string) {
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
        throw new Error('NEXT_PUBLIC_BASE_URL is required for verification link generation.');
    }

    if (!process.env.SMTP_HOST) {
        throw new Error('SMTP configuration is missing. Set SMTP_HOST, SMTP_USER, SMTP_PASS in env.');
    }

    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/confirm?token=${encodeURIComponent(token)}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || `no-reply@${new URL(process.env.NEXT_PUBLIC_BASE_URL!).hostname}`,
        to,
        subject: 'Confirm your email',
        html: `
      <p>Thanks for registering. Click the link below to confirm your email and activate your account:</p>
      <p><a href="${confirmUrl}">Confirm email</a></p>
      <p>If you did not register, ignore this email.</p>
    `,
        text: `Confirm your email: ${confirmUrl}`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
}
