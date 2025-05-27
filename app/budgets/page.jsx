"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { secureApiCall } from "@/utils/api";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

export default function BudgetsPage() {
    const router = useRouter();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // State for selected period
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    // Add budget form state
    const [form, setForm] = useState({
        amount: "",
    });
    const [loading, setLoading] = useState(false);
    const [budgets, setBudgets] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    // Fetch budgets when year/month changes
    useEffect(() => {
        fetchBudgets();
    }, [year, month]);

    const fetchBudgets = async () => {
        setListLoading(true);
        const token = Cookies.get("token");
        try {
            const res = await secureApiCall({
                endpoint: "/api/budget/list",
                data: { year, month },
                token,
                requiresAuth: true,
            });
            if (res.code === "1") {
                setBudgets(res.data);
            } else {
                setBudgets([]);
            }
        } catch {
            setBudgets([]);
            toast.error("Failed to load budgets.");
        } finally {
            setListLoading(false);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = Cookies.get("token");
        try {
            const res = await secureApiCall({
                endpoint: "/api/budget/set",
                data: {
                    amount: Number(form.amount),
                    year,
                    month,
                },
                token,
                requiresAuth: true,
            });
            if (res.code === "1") {
                toast.success("Budget added!");
                setForm({ amount: "" });
                fetchBudgets();
                router.push("/")
            } else {
                toast.error(res.message || "Failed to add budget.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--background)] flex flex-col items-center p-6">
            <ToastContainer theme="light" />

            {/* Year/Month Selector */}
            <div className="flex gap-4 mb-8">
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="px-4 py-2 bg-white text-[var(--foreground)] border-cool rounded-md focus:ring-[var(--accent)]"
                >
                    {[...Array(5)].map((_, i) => (
                        <option key={i} value={currentYear - 2 + i}>
                            {currentYear - 2 + i}
                        </option>
                    ))}
                </select>
                <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="px-4 py-2 bg-white text-[var(--foreground)] border-cool rounded-md focus:ring-[var(--accent)]"
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </option>
                    ))}
                </select>
            </div>

            {/* Add Budget Form */}
            <div className="w-full max-w-md bg-white shadow-cool p-8 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4 text-center">
                    Add Monthly Budget
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        name="amount"
                        type="number"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white border-cool rounded-md focus:ring-[var(--accent)]"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--accent)] text-white font-semibold py-3 hover-gradient rounded-xl disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Budget"}
                    </button>
                </form>
            </div>

            {/* Budgets List */}
            <div className="w-full max-w-2xl bg-white shadow-cool p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4 text-center">
                    Monthly Budgets
                </h2>
                {listLoading ? (
                    <div className="text-center text-[var(--secondary)] py-8">Loading...</div>
                ) : budgets.length === 0 ? (
                    <div className="text-center text-[var(--secondary)] py-8">
                        No budgets found for this month.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr>
                                    <th className="py-2 px-2 font-semibold text-[var(--secondary)]">Amount</th>
                                    <th className="py-2 px-2 font-semibold text-[var(--secondary)]">Month</th>
                                    <th className="py-2 px-2 font-semibold text-[var(--secondary)]">Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgets.map((b) => (
                                    <tr key={b.id}>
                                        <td className="py-2 px-2 font-semibold">₹{Number(b.amount).toFixed(2)}</td>
                                        <td className="py-2 px-2">{b.month}</td>
                                        <td className="py-2 px-2">{b.year}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}