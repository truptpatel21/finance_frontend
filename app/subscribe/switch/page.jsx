"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { toast } from "react-toastify";

function getPlanOrder(value) {
    if (value === "free") return 0;
    if (value === "pro") return 1;
    if (value === "elite") return 2;
    return -1;
}

function SubscriptionSwitchContent() {
    const params = useSearchParams();
    const router = useRouter();
    const targetPlan = params.get("target");
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPreview = async () => {
            if (!targetPlan) return;
            setLoading(true);
            const token = Cookies.get("token");
            const res = await secureApiCall({
                endpoint: "/api/subscription/preview",
                data: { target_plan: targetPlan },
                token,
                requiresAuth: true,
            });
            setPreview(res);
            setLoading(false);
        };
        fetchPreview();
    }, [targetPlan]);

    const handleDowngrade = async () => {
        setLoading(true);
        const token = Cookies.get("token");
        const res = await secureApiCall({
            endpoint: "/api/subscription/downgrade",
            data: { target_plan: targetPlan },
            token,
            requiresAuth: true,
        });
        if (res.code === "1") {
            toast.success("Your downgrade will take effect after your current plan expires.");
            router.push("/subscribe");
        } else {
            toast.error(res.message || "Failed to downgrade.");
            router.push("/subscribe");
        }
        setLoading(false);
    };

    if (loading || !preview) return <div className="p-8 text-center">Loading...</div>;

    const currentOrder = getPlanOrder(preview.currentPlan);
    const targetOrder = getPlanOrder(preview.targetPlan);
    const isUpgrade = targetOrder > currentOrder;
    const isDowngrade = targetOrder < currentOrder;
    const isPaidPlan = targetOrder > 0;
    const isDowngradeToFree = preview.targetPlan === "free";
    const isPaidToPaid = isDowngrade && isPaidPlan;

    return (
        <main className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-10">
            <h2 className="text-2xl font-bold mb-4">Change Subscription</h2>
            <div className="mb-4">
                <div>
                    <b>Current Plan:</b> {preview.currentPlan?.toUpperCase()}
                    {preview.currentPlan !== "free" && preview.expiry && (
                        <span className="ml-2 text-gray-500 text-sm">
                            (expires: {new Date(preview.expiry).toLocaleDateString()})
                        </span>
                    )}
                </div>
                <div>
                    <b>Target Plan:</b> {preview.targetPlan?.toUpperCase()}
                </div>
            </div>
            <div className="mb-6 p-4 bg-blue-50 rounded">{preview.message}</div>

            {(isUpgrade || (isDowngrade && isPaidPlan && !isDowngradeToFree)) && (
                <div>
                    <button
                        className="btn-gradient px-6 py-2 rounded"
                        onClick={() => router.push(`/subscribe/payment?plan=${preview.targetPlan}`)}
                    >
                        Pay & Switch
                    </button>
                </div>
            )}

            {isDowngradeToFree && (
                <div>
                    <div className="mb-2 text-yellow-700">
                        Your downgrade to FREE will take effect after your current plan ends.
                    </div>
                    <button
                        className="bg-yellow-500 text-white px-6 py-2 rounded"
                        onClick={handleDowngrade}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Confirm Downgrade"}
                    </button>
                </div>
            )}

            {preview.action === "current" && (
                <div>
                    <div className="text-green-600">You are already on this plan.</div>
                </div>
            )}
        </main>
    );
}

export default function SubscriptionSwitchPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <SubscriptionSwitchContent />
        </Suspense>
    );
}