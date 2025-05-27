"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RecurringTransactionsPage() {
    const [recurring, setRecurring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [showAdd, setShowAdd] = useState(false);

    // Add form state
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [frequency, setFrequency] = useState("monthly");
    const [nextDueDate, setNextDueDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [addLoading, setAddLoading] = useState(false);

    // Category list
    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(false);

    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }
        fetchCategories();
        fetchRecurring();
        // eslint-disable-next-line
    }, [year, month]);

    const fetchCategories = async () => {
        setCatLoading(true);
        try {
            const res = await secureApiCall({
                endpoint: "/api/category/list",
                data: {},
                token,
                requiresAuth: true,
            });
            if (res.code === "1") {
                setCategories(res.data);
            } else {
                setCategories([]);
                toast.error("Failed to load categories.");
            }
        } catch {
            setCategories([]);
            toast.error("Failed to load categories.");
        } finally {
            setCatLoading(false);
        }
    };

    const fetchRecurring = async () => {
        setLoading(true);
        try {
            const res = await secureApiCall({
                endpoint: "/api/recurring/list",
                data: { year, month },
                token,
                requiresAuth: true,
            });
            setRecurring(res.code === "1" ? res.data : []);
        } catch {
            toast.error("Failed to fetch recurring transactions.");
            setRecurring([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecurring = async (e) => {
        e.preventDefault();
        if (!amount || !categoryId || !frequency || !nextDueDate) {
            toast.error("Please fill all required fields.");
            return;
        }
        setAddLoading(true);
        try {
            const res = await secureApiCall({
                endpoint: "/api/recurring/add",
                data: {
                    amount,
                    category_id: categoryId,
                    frequency,
                    next_due_date: nextDueDate,
                    end_date: endDate || undefined,
                },
                token,
                requiresAuth: true,
            });
            if (res.code === "1") {
                toast.success("Recurring transaction added!");
                setShowAdd(false);
                setAmount("");
                setCategoryId("");
                setFrequency("monthly");
                setNextDueDate("");
                setEndDate("");
                fetchRecurring();
            } else {
                toast.error(res.messages?.keyword || "Failed to add recurring transaction.");
            }
        } catch {
            toast.error("Failed to add recurring transaction.");
        } finally {
            setAddLoading(false);
        }
    };

    // Helper to get category name by id
    const getCategoryName = (id) => {
        const cat = categories.find((c) => c.id === id);
        return cat ? cat.name : "Unknown";
    };

    // Helper to get category type by id
    const getCategoryType = (id) => {
        const cat = categories.find((c) => c.id === id);
        return cat ? cat.type : "";
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-6">
            <ToastContainer theme="light" />
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-cool border border-[var(--accent)]">
                <h2 className="text-3xl font-bold text-[var(--accent)] mb-8 text-center tracking-wide">
                    Upcoming Recurring Transactions
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

                {showAdd ? (
                    <form onSubmit={handleAddRecurring} className="space-y-6 mb-8">
                        <div>
                            <label className="block mb-1 font-medium">Amount <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={amount} placeholder="Enter amount"
                                onChange={e => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Category <span className="text-red-500">*</span></label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg"
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name} ({cat.type})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Frequency <span className="text-red-500">*</span></label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg"
                                value={frequency}
                                onChange={e => setFrequency(e.target.value)}
                                required
                            >
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="yearly">Yearly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Next Due Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={nextDueDate}
                                onChange={e => setNextDueDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">End Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="w-full bg-[var(--accent)] text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                                disabled={addLoading}
                            >
                                {addLoading ? "Adding..." : "Add Recurring Transaction"}
                            </button>
                            <button
                                type="button"
                                className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
                                onClick={() => setShowAdd(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        className="mb-8 w-full bg-[var(--accent)] text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => setShowAdd(true)}
                    >
                        Add Recurring Transaction
                    </button>
                )}

                {loading ? (
                    <div className="text-center py-16">Loading...</div>
                ) : recurring.length === 0 ? (
                    <div className="text-center text-gray-500">No upcoming recurring transactions found.</div>
                ) : (
                    <div className="space-y-4">
                        {recurring.map((rec, idx) => (
                            <div
                                key={rec.id || idx}
                                className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-sm text-gray-600">{rec.frequency} Transaction</p>
                                    <p className="text-lg font-semibold text-gray-800">₹{Number(rec.amount || 0).toFixed(2)}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Due: {rec.next_due_date ? new Date(rec.next_due_date).toLocaleDateString() : ""}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Category: {getCategoryName(rec.category_id)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Type: {getCategoryType(rec.category_id)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    className="mt-8 w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => router.push("/")}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}