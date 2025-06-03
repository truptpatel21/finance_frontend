"use client";
import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm.jsx";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}