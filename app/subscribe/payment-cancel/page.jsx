"use client";
import { useRouter, useSearchParams, Suspense } from "next/navigation";
import { useEffect } from "react";

function CanceledContent() {
    const router = useRouter();
    const params = useSearchParams();
    const plan = params.get("plan");

    useEffect(() => {
        setTimeout(() => router.push("/subscribe"), 3000);
    }, [router]);

    return (
        <main className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow mt-10 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-700">Payment Canceled</h2>
            <div className="mb-4">Your {plan?.toUpperCase()} plan is now canceled.</div>
            <div className="text-gray-500">Redirecting to subscription page...</div>
        </main>
    );
}

export default function PaymentCanceled() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <CanceledContent />
        </Suspense>
    );
}