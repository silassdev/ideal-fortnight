"use client";
import { Suspense } from "react";



export default function AuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
        </Suspense>
    );
}
