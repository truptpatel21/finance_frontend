"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TopCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }
        fetchCategories();
        // eslint-disable-next-line
    }, [year, month]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
            const endDate = `${year}-${month.toString().padStart(2, "0")}-31`;
            const res = await secureApiCall({
                endpoint: "/api/analytics/top-categories",
                data: { start_date: startDate, end_date: endDate },
                token,
                requiresAuth: true,
            });
            setCategories(res.code === "1" ? res.data : []);
        } catch {
            toast.error("Failed to fetch top categories.");
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: categories.map((cat) => cat.category),
        datasets: [
            {
                data: categories.map((cat) => Number(cat.total_spent || 0)),
                backgroundColor: ["#60A5FA", "#34D399", "#F87171", "#FBBF24", "#A78BFA"],
                borderColor: "#fff",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-6">
            <ToastContainer theme="light" />
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-cool border border-[var(--accent)]">
                <h2 className="text-3xl font-bold text-[var(--accent)] mb-8 text-center tracking-wide">
                    Top Spending Categories
                </h2>
                <div className="flex gap-4 mb-6 justify-center">
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="px-4 py-2 bg-white text-gray-900 border rounded-lg"
                    >
                        {[...Array(5)].map((_, i) => (
                            <option key={i} value={new Date().getFullYear() - 2 + i}>
                                {new Date().getFullYear() - 2 + i}
                            </option>
                        ))}
                    </select>
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="px-4 py-2 bg-white text-gray-900 border rounded-lg"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                            </option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <div className="text-center py-16">Loading...</div>
                ) : categories.length === 0 ? (
                    <div className="text-center text-gray-500">No spending data found for this period.</div>
                ) : (
                    <>
                        <div className="h-72 mb-6">
                            <Doughnut
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: "bottom" },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    const total = categories.reduce((sum, c) => sum + Number(c.total_spent || 0), 0);
                                                    const value = context.parsed;
                                                    const percent = total ? ((value / total) * 100).toFixed(1) : 0;
                                                    return `${context.label}: ₹${value.toFixed(2)} (${percent}%)`;
                                                },
                                            },
                                        },
                                    },
                                    animation: { duration: 1000, easing: "easeOutQuart" },
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            {categories.map((cat, idx) => (
                                <div key={cat.category + "-" + idx} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                                    <span className="text-gray-700">{cat.category}</span>
                                    <span className="font-semibold text-blue-600">₹{Number(cat.total_spent || 0).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <button
                    className="mt-8 w-full bg-[var(--accent)] text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => router.push("/")}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}