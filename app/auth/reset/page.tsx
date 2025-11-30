import ResetForm from '@/components/auth/ResetForm';
import type { ReactElement } from 'react';

export default function ResetPage({ searchParams }: { searchParams?: { token?: string } }): ReactElement {
    const token = searchParams?.token || '';
    return <ResetForm token={token} />;
}
