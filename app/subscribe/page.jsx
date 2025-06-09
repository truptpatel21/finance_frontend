"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { toast } from "react-toastify";

const plans = [
    {
        name: "Free",
        price: "₹0",
        features: [
            "Basic dashboard",
            "Add transactions",
            "Set budgets & goals",
        ],
        value: "free",
        highlight: false,
    },
    {
        name: "Pro",
        price: "₹199/mo",
        features: [
            "Everything in Free",
            "Download PDF reports",
            "Spending insights",
            "Priority support",
        ],
        value: "pro",
        highlight: true,
    },
    {
        name: "Elite",
        price: "₹499/mo",
        features: [
            "Everything in Pro",
            "Advanced analytics",
            "Unlimited goals",
            "Early access to features",
        ],
        value: "elite",
        highlight: false,
    },
];

const planComparison = [
    {
        feature: "Budget Tracking",
        free: "Basic",
        pro: "Advanced",
        elite: "Advanced + Wealth Advisor",
    },
    {
        feature: "Goal Setting",
        free: "Limited",
        pro: "Unlimited",
        elite: "Unlimited",
    },
    {
        feature: "Reports",
        free: "No",
        pro: "PDF Reports",
        elite: "Custom Reports",
    },
    {
        feature: "Analytics",
        free: "No",
        pro: "Spending Insights",
        elite: "Advanced Analytics",
    },
    {
        feature: "Support",
        free: "Standard",
        pro: "Priority",
        elite: "Priority + Advisor",
    },
    {
        feature: "Early Access",
        free: "No",
        pro: "No",
        elite: "Yes",
    },
];

function getPlanOrder(value) {
    // For comparison: free < pro < elite
    if (value === "free") return 0;
    if (value === "pro") return 1;
    if (value === "elite") return 2;
    return -1;
}

export default function SubscribePage() {
    const [loading, setLoading] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);

    useEffect(() => {
        const fetchCurrentPlan = async () => {
            const token = Cookies.get("token");
            if (!token) return;
            const res = await secureApiCall({
                endpoint: "/api/users/me",
                data: {},
                token,
                requiresAuth: true,
            });
            if (res.code === "1") {
                setCurrentPlan(res.data?.user?.subscription_plan || "free");
            }
        };
        fetchCurrentPlan();
    }, []);

    const handleSubscribe = async (plan) => {
        if (plan === currentPlan) {
            toast.info("You are already on this plan!");
            return;
        }
        setLoading(true);
        try {
            const token = Cookies.get("token");
            // If downgrading to free, call a downgrade endpoint
            if (plan === "free") {
                const res = await secureApiCall({
                    endpoint: "/api/subscription/downgrade",
                    data: {},
                    token,
                    requiresAuth: true,
                });
                if (res.code === "1") {
                    toast.success("Successfully downgraded to Free plan.");
                    setCurrentPlan("free");
                } else {
                    toast.error(res.message || "Failed to downgrade.");
                }
            } else {
                // Upgrading or switching paid plan
                const res = await secureApiCall({
                    endpoint: "/api/stripe/session",
                    data: { plan },
                    token,
                    requiresAuth: true,
                });
                if (res.url) {
                    window.location.href = res.url;
                } else {
                    toast.error("Failed to start subscription.");
                }
            }
        } catch (err) {
            toast.error("Error updating subscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center py-12">
            <h1 className="text-4xl font-bold mb-2 text-blue-700">Choose Your Plan</h1>
            {currentPlan && (
                <div className="mb-8 text-center">
                    <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                        Your Current Plan: {currentPlan.toUpperCase()}
                    </span>
                </div>
            )}
            {/* Plan Comparison Table */}
            <div className="w-full max-w-4xl mb-12 overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg bg-white shadow">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-lg font-semibold">Feature</th>
                            <th className="py-3 px-4 border-b text-blue-700">Free</th>
                            <th className="py-3 px-4 border-b text-indigo-700">Pro</th>
                            <th className="py-3 px-4 border-b text-purple-700">Elite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planComparison.map((row, idx) => (
                            <tr key={idx} className="border-t">
                                <td className="py-2 px-4 font-medium">{row.feature}</td>
                                <td className="py-2 px-4 text-center">{row.free}</td>
                                <td className="py-2 px-4 text-center">{row.pro}</td>
                                <td className="py-2 px-4 text-center">{row.elite}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Plan Cards */}
            <div className="flex flex-wrap gap-8 justify-center">
                {plans.map((plan) => {
                    const isCurrent = currentPlan === plan.value;
                    const isUpgrade =
                        getPlanOrder(plan.value) > getPlanOrder(currentPlan);
                    const isDowngrade =
                        getPlanOrder(plan.value) < getPlanOrder(currentPlan);

                    let buttonText = "Subscribe";
                    if (isCurrent) buttonText = "Current Plan";
                    else if (isUpgrade) buttonText = "Upgrade";
                    else if (isDowngrade) buttonText = "Downgrade";

                    return (
                        <div
                            key={plan.value}
                            className={`rounded-xl shadow-lg bg-white p-8 w-80 flex flex-col items-center border-2 ${plan.highlight
                                ? "border-blue-600 scale-105"
                                : "border-gray-200"
                                } transition-transform`}
                        >
                            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                            <div className="text-3xl font-bold mb-4 text-blue-700">{plan.price}</div>
                            <ul className="mb-6 text-gray-700 space-y-2">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span className="text-green-500">✔</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`px-6 py-2 rounded-lg font-semibold text-white ${isCurrent
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : isUpgrade
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : isDowngrade
                                            ? "bg-yellow-500 hover:bg-yellow-600"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                disabled={loading || isCurrent}
                                onClick={() => handleSubscribe(plan.value)}
                            >
                                {isCurrent ? "Current Plan" : loading ? "Processing..." : buttonText}
                            </button>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}