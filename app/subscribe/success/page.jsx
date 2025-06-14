"use client";
export const dynamic = "force-dynamic";
import { useRouter, useSearchParams} from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

function SuccessContent() {
    const router = useRouter();
    const params = useSearchParams();
    const plan = params.get("plan");

    useEffect(() => {
        setTimeout(() => router.push("/subscribe"), 3000);
    }, [router]);

    return (
        <main className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow mt-10 text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Payment Successful!</h2>
            <div className="mb-4">Your {plan?.toUpperCase() || "plan"} is now active.</div>
            <div className="text-gray-500">Redirecting to Subscription Page...</div>
        </main>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}