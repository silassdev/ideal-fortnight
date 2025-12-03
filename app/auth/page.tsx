import { redirect } from 'next/navigation';

export default function AuthPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const mode = searchParams?.mode === 'register' ? 'register' : 'login';
    redirect(`/?auth=${mode}`);
}
