import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    passwordHash?: string | null;
    isVerified: boolean;
    role: 'user' | 'admin';
    verificationToken?: string | null;
    createdIp?: string | null;
    lastLoginIp?: string | null;
    country?: string | null;
    region?: string | null;
    city?: string | null;
    ipInfo?: any | null;
    lastLoginAt?: Date | null;
    verifiedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    verificationToken: { type: String, default: null },

    createdIp: { type: String, default: null },
    lastLoginIp: { type: String, default: null },
    country: { type: String, default: null },
    region: { type: String, default: null },
    city: { type: String, default: null },
    ipInfo: { type: mongoose.Schema.Types.Mixed, default: null },
    lastLoginAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: null },
}, { timestamps: true });

const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default User;
