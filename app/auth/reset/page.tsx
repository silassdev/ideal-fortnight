import ResetForm from '@/components/auth/ResetForm';
import type { ReactElement } from 'react';

export default async function ResetPage({
    searchParams
}: {
    searchParams: Promise<{ token?: string }>
}): Promise<ReactElement> {
    const params = await searchParams;
    const token = params?.token || '';

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <ResetForm token={token} />
        </div>
    );
}
