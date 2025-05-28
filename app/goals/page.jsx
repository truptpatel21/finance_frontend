"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { secureApiCall } from "@/utils/api";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

export default function GoalsPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        description: "",
        target_amount: "",
        deadline: "",
    });
    const [loading, setLoading] = useState(false);
    const [goals, setGoals] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        setListLoading(true);
        const token = Cookies.get("token");
        try {
            const res = await secureApiCall({
                endpoint: "/api/goals/list",
                data: {},
                token,
                requiresAuth: true,
            });
            if (res.code === "1") {
                setGoals(res.data);
            } else {
                setGoals([]);
            }
        } catch {
            setGoals([]);
            toast.error("Failed to load goals.");
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
                endpoint: "/api/goals/add",
                data: {
                    name: form.name,
                    description: form.description,
                    target_amount: Number(form.target_amount),
                    current_amount: 0,
                    deadline: form.deadline,
                },
                token,
                requiresAuth: true,
            });
            if (res.code === "1") {
                toast.success("Goal added!");
                setForm({
                    name: "",
                    description: "",
                    target_amount: "",
                    deadline: "",
                });
                fetchGoals();
                router.push("/dashboard")
            } else {
                toast.error(res.message || "Failed to add goal.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--background)] flex flex-col items-center p-6">
            <ToastContainer theme="light" />
            <div className="w-full max-w-md bg-white shadow-cool p-8 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4 text-center">Add Goal</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        name="name"
                        type="text"
                        placeholder="Goal Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white border-cool rounded-md focus:ring-[var(--accent)]"
                    />
                    <input
                        name="description"
                        type="text"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white border-cool rounded-md focus:ring-[var(--accent)]"
                    />
                    <input
                        name="target_amount"
                        type="number"
                        placeholder="Target Amount"
                        value={form.target_amount}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white border-cool rounded-md focus:ring-[var(--accent)]"
                    />
                    <input
                        name="deadline"
                        type="date"
                        placeholder="Deadline"
                        value={form.deadline}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white border-cool rounded-md focus:ring-[var(--accent)]"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--accent)] text-white font-semibold py-3 hover-gradient rounded-xl disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Goal"}
                    </button>
                </form>
            </div>

            <div className="w-full max-w-2xl bg-white shadow-cool p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4 text-center">Your Goals</h2>
                {listLoading ? (
                    <div className="text-center text-[var(--secondary)] py-8">Loading...</div>
                ) : goals.length === 0 ? (
                    <div className="text-center text-[var(--secondary)] py-8">No goals found.</div>
                ) : (
                    <div className="space-y-4">
                        {goals.map((goal) => (
                            <div key={goal.id} className="p-4 bg-[var(--highlight)] rounded flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-[var(--secondary)]">{goal.name}</p>
                                    <p className="text-lg font-bold">{goal.description}</p>
                                    <p className="text-sm text-[var(--secondary)]">Deadline: {goal.deadline ? goal.deadline.slice(0, 10) : ""}</p>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                    <span className="text-[var(--accent)] font-semibold">
                                        Target: ₹{Number(goal.target_amount || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}