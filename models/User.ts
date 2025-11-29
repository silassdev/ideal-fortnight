import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String }, // optional (users who register via OAuth may not have this)
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true, collection: 'users' },
);

// Avoid model overwrite in dev/hot-reload
const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default User;
