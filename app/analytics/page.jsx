"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AnalyticsPage() {
    const [incomeExpenseData, setIncomeExpenseData] = useState(null);
    const [balanceData, setBalanceData] = useState(null);
    const [spendingTrends, setSpendingTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const token = Cookies.get("token");

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }
        fetchAnalytics();
        // eslint-disable-next-line
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Example endpoints, adjust as per your backend
            const [incomeExpenseRes, balanceRes, trendsRes] = await Promise.all([
                secureApiCall({ endpoint: "/api/analytics/income-expense", data: {}, token, requiresAuth: true }),
                secureApiCall({ endpoint: "/api/analytics/balance", data: {}, token, requiresAuth: true }),
                secureApiCall({ endpoint: "/api/analytics/spending-trends", data: {}, token, requiresAuth: true }),
            ]);
            setIncomeExpenseData(incomeExpenseRes.code === "1" ? incomeExpenseRes.data : null);
            setBalanceData(balanceRes.code === "1" ? balanceRes.data : null);
            setSpendingTrends(trendsRes.code === "1" ? trendsRes.data : null);
        } catch {
            toast.error("Failed to fetch analytics data.");
            setIncomeExpenseData(null);
            setBalanceData(null);
            setSpendingTrends(null);
        } finally {
            setLoading(false);
        }
    };

    // Example chart data (fallback if API is empty)
    const fallbackIncomeExpense = {
        labels: [
            "01.2024", "02.2024", "03.2024", "04.2024", "05.2024", "06.2024", "07.2024", "08.2024", "09.2024", "10.2024", "11.2024", "12.2024"
        ],
        datasets: [
            {
                type: "bar",
                label: "Income",
                data: [20000, 25000, 45000, 17000, 23000, 23000, 27000, 55000, 44000, 21000, 35000, 42000],
                backgroundColor: "#34D399",
                borderRadius: 6,
            },
            {
                type: "bar",
                label: "Outcome",
                data: [12000, 9000, 22000, 3000, 8000, 14000, 17000, 21000, 25000, 27000, 33000, 25000],
                backgroundColor: "#F87171",
                borderRadius: 6,
            },
            {
                type: "line",
                label: "Balance",
                data: [8000, 16000, 23000, 14000, 15000, 9000, 10000, 34000, 19000, -6000, 2000, 17000],
                borderColor: "#2563EB",
                backgroundColor: "#2563EB22",
                tension: 0.4,
                fill: false,
                yAxisID: "y1",
                pointRadius: 4,
                pointBackgroundColor: "#2563EB",
            },
        ],
    };

    const fallbackBalance = {
        labels: [
            "01.2024", "02.2024", "03.2024", "04.2024", "05.2024", "06.2024", "07.2024", "08.2024", "09.2024", "10.2024", "11.2024", "12.2024"
        ],
        datasets: [
            {
                label: "Account Balance",
                data: [5000, 12000, 35000, 49000, 64000, 73000, 83000, 117000, 136000, 130000, 132000, 149000],
                borderColor: "#2563EB",
                backgroundColor: "#2563EB22",
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: "#2563EB",
            },
            {
                label: "Income",
                data: [20000, 25000, 45000, 17000, 23000, 23000, 27000, 55000, 44000, 21000, 35000, 42000],
                borderColor: "#34D399",
                backgroundColor: "#34D39922",
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: "#34D399",
            },
        ],
    };

    const fallbackTrends = {
        labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
            {
                label: "Spending",
                data: [5700, 5900, 6100, 4700, 5900, 3500],
                backgroundColor: "#3B82F6",
                borderRadius: 6,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-6">
            <ToastContainer theme="light" />
            <div className="w-full max-w-5xl">
                <h1 className="text-3xl font-bold text-[var(--accent)] mb-8 text-center">Analytics</h1>
                {loading ? (
                    <div className="text-center py-16">Loading analytics...</div>
                ) : (
                    <div className="space-y-12">
                        {/* Income & Expense Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-cool mb-8">
                            <h2 className="text-xl font-semibold text-[var(--accent)] mb-4">Income & Expense</h2>
                            <div className="h-80">
                                <Bar
                                    data={incomeExpenseData || fallbackIncomeExpense}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: "bottom" },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => {
                                                        if (context.dataset.type === "line") {
                                                            return `Balance: ₹${context.parsed.y}`;
                                                        }
                                                        return `${context.dataset.label}: ₹${context.parsed.y}`;
                                                    },
                                                },
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: { callback: (value) => `₹${value}` },
                                            },
                                            y1: {
                                                beginAtZero: true,
                                                position: "right",
                                                grid: { drawOnChartArea: false },
                                                ticks: { callback: (value) => `₹${value}` },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        {/* Account Balance Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-cool mb-8">
                            <h2 className="text-xl font-semibold text-[var(--accent)] mb-4">Account Balance</h2>
                            <div className="h-80">
                                <Line
                                    data={balanceData || fallbackBalance}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: "bottom" },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => `${context.dataset.label}: ₹${context.parsed.y}`,
                                                },
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: { callback: (value) => `₹${value}` },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        {/* Spending Trends */}
                        <div className="bg-white p-6 rounded-xl shadow-cool mb-8">
                            <h2 className="text-xl font-semibold text-[var(--accent)] mb-4">Spending Trends</h2>
                            <div className="h-64">
                                <Bar
                                    data={spendingTrends || fallbackTrends}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => `Spending: ₹${context.parsed.y}`,
                                                },
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: { callback: (value) => `₹${value}` },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}