"use client";

import { useSearchParams, useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function AuthPage() {
    const params = useSearchParams();
    const router = useRouter();

    const mode = params?.get("mode") === "register" ? "register" : "login";

    const toggle = () => {
        router.push(`/auth?mode=${mode === "login" ? "register" : "login"}`);
    };

    return (
        <div>
            {mode === "login" ? <LoginForm /> : <RegisterForm />}

            <button
                onClick={toggle}
                className="w-full mt-6 text-sm text-blue-600 hover:underline"
            >
                {mode === "login"
                    ? "Don't have an account? Register"
                    : "Already registered? Login"}
            </button>
        </div>
    );
}
