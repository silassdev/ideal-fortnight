import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextAuth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Resume from '@/models/Resume';

export async function DELETE(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions as any);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const userEmail = session.user.email.toLowerCase();

        // Find the user
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Delete all user's resumes
        await Resume.deleteMany({ userId: user._id });

        // Delete the user account
        await User.deleteOne({ _id: user._id });

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error: any) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete account' },
            { status: 500 }
        );
    }
}
