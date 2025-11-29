import 'dotenv/config';
import bcrypt from 'bcryptjs';
import dbConnect from '../lib/dbConnect';
import User from '../models/User';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env.local');
    process.exit(1);
}

const adminEmail: string = ADMIN_EMAIL;
const adminPassword: string = ADMIN_PASSWORD;

async function seedAdmin() {
    try {
        await dbConnect();

        const email = adminEmail.toLowerCase().trim();

        const existing = await User.findOne({ email });

        if (existing) {
            console.log('✅ Admin already exists:', existing.email);
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(adminPassword, 10);

        const admin = await User.create({
            name: 'Admin',
            email,
            passwordHash,
            isVerified: true,
            role: 'admin',
        });

        console.log('✅ Admin user created:', admin.email, admin._id);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seedAdmin();
