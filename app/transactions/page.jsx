"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { secureApiCall } from "@/utils/api";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

export default function TransactionsPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        amount: "",
        category_id: "",
        type: "expense",
        date: "",
        note: "",
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    // Fetch categories and transactions on mount
    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, []);

    const fetchCategories = async () => {
        const token = Cookies.get("token");
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
        }
    };

    const fetchTransactions = async () => {
        setListLoading(true);
        const token = Cookies.get("token");
        try {
            const res = await secureApiCall({
                endpoint: "/api/transaction/list",
                data: {},
                token,
                requiresAuth: true,
            });
            if (res.code === "1") {
                setTransactions(res.data);
            } else {
                setTransactions([]);
                // toast.error("Failed to load transactions.");
            }
        } catch {
            setTransactions([]);
            toast.error("Failed to load transactions.");
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
                endpoint: "/api/transaction/add",
                data: {
                    ...form,
                    amount: Number(form.amount),
                    category_id: Number(form.category_id),
                    transaction_date: form.date,
                },
                token,
                requiresAuth: true,
            });
            if (res.code === "1") {
                toast.success("Transaction added!");
                setForm({
                    amount: "",
                    category_id: "",
                    type: "expense",
                    date: "",
                    note: "",
                });
                fetchTransactions();
                router.push("/"); // Refresh the page to show new transaction
            } else {
                toast.error(res.message || "Failed to add transaction.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper to get category name by id
    const getCategoryName = (id) => {
        const cat = categories.find((c) => c.id === id);
        return cat ? cat.name : "Unknown";
    };

    return (
        <main className="min-h-screen bg-[var(--background)] flex flex-col items-center p-6">
            <ToastContainer theme="light" />
            <div className="w-full max-w-md bg-white shadow-cool p-8 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4 text-center">Add Transaction</h2>
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
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white border-cool rounded-md focus:ring-[var(--accent)]"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border-cool rounded-md focus:ring-[var(--accent)]"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <input
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white border-cool rounded-md focus:ring-[var(--accent)]"
                    />
                    <input
                        name="note"
                        type="text"
                        placeholder="Note (optional)"
                        value={form.note}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border-cool rounded-md focus:ring-[var(--accent)]"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--accent)] text-white font-semibold py-3 hover-gradient rounded-xl disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Transaction"}
                    </button>
                </form>
            </div>

            <div className="w-full max-w-2xl bg-white shadow-cool p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4 text-center">Recent Transactions</h2>
                {listLoading ? (
                    <div className="text-center text-[var(--secondary)] py-8">Loading...</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center text-[var(--secondary)] py-8">No transactions found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr>
                                    <th className="py-2 px-2 font-semibold text-[var(--secondary)]">Date</th>
                                    <th className="py-2 px-2 font-semibold text-[var(--secondary)]">Type</th>
                                    <th className="py-2 px-2 font-semibold text-[var(--secondary)]">Category</th>
                                    <th className="py-2 px-2 font-semibold text-[var(--secondary)]">Amount</th>
                                    <th className="py-2 px-2 font-semibold text-[var(--secondary)]">Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <tr key={txn.id}>
                                        <td className="py-2 px-2">{txn.transaction_date ? txn.transaction_date.slice(0, 10) : ""}</td>
                                        <td className="py-2 px-2 capitalize">{txn.type}</td>
                                        <td className="py-2 px-2">{getCategoryName(txn.category_id)}</td>
                                        <td className={`py-2 px-2 font-semibold ${txn.type === "expense" ? "text-red-500" : "text-green-600"}`}>
                                            ₹{Number(txn.amount).toFixed(2)}
                                        </td>
                                        <td className="py-2 px-2">{txn.note}</td>
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