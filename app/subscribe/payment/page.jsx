"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { toast } from "react-toastify";

const PLAN_LABELS = {
    pro: { name: "Pro", price: "₹199/mo" },
    elite: { name: "Elite", price: "₹499/mo" }
};

export default function PaymentPage() {
    const params = useSearchParams();
    const router = useRouter();
    const plan = params.get("plan");
    const [loading, setLoading] = useState(false);

    if (!plan || !PLAN_LABELS[plan]) {
        return <div className="p-8 text-center text-red-600">Invalid plan selected.</div>;
    }

    const handlePay = async () => {
        setLoading(true);
        const token = Cookies.get("token");
        const res = await secureApiCall({
            endpoint: "/api/stripe/session",
            data: { plan },
            token,
            requiresAuth: true,
        });
        setLoading(false);
        if (res.url) {
            window.location.href = res.url;
        } else {
            toast.error(res.message || "Failed to start payment.");
        }
    };

    return (
        <main className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Confirm & Pay</h2>
            <div className="mb-6 p-4 bg-blue-50 rounded text-center">
                <div className="text-xl font-semibold mb-2">{PLAN_LABELS[plan].name} Plan</div>
                <div className="text-2xl font-bold text-blue-700">{PLAN_LABELS[plan].price}</div>
            </div>
            <button
                className="btn-gradient px-8 py-3 rounded text-lg w-full"
                onClick={handlePay}
                disabled={loading}
            >
                {loading ? "Redirecting to Payment..." : `Pay & Subscribe`}
            </button>
            <div className="mt-6 text-center text-gray-500 text-sm">
                You will be redirected to Stripe to complete your payment securely.
            </div>
        </main>
    );
}