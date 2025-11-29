// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    passwordHash?: string | null;
    isVerified: boolean;
    role: 'user' | 'admin';
    verificationToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, default: null },
        isVerified: { type: Boolean, default: false },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        verificationToken: { type: String, default: null }
    },
    { timestamps: true }
);

const User: Model<IUser> =
    (mongoose.models && (mongoose.models.User as Model<IUser>)) || mongoose.model<IUser>('User', UserSchema);

export default User;
