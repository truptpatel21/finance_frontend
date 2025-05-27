"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchNotifications = async () => {
        setLoading(true);
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to view notifications.");
            setLoading(false);
            return;
        }
        try {
            const res = await secureApiCall({
                endpoint: "/api/notification/list",
                data: {},
                token,
                requiresAuth: true,
            });
            setNotifications(res.code === "1" ? res.data : []);
        } catch {
            toast.error("Failed to fetch notifications.");
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-6">
            <ToastContainer theme="light" />
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-cool border border-[var(--accent)]">
                <h2 className="text-3xl font-bold text-[var(--accent)] mb-8 text-center tracking-wide">
                    Notifications
                </h2>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center text-gray-500">No notifications found.</div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-4 rounded-xl border ${n.is_read
                                        ? "bg-[var(--highlight)] border-[var(--border)]"
                                        : "bg-blue-50 border-blue-200"
                                    } flex flex-col sm:flex-row sm:items-center sm:justify-between`}
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className={`inline-block w-2 h-2 rounded-full ${n.type === "alert"
                                                    ? "bg-red-500"
                                                    : n.type === "reminder"
                                                        ? "bg-yellow-400"
                                                        : "bg-blue-400"
                                                }`}
                                        ></span>
                                        <span className="font-semibold text-[var(--accent)]">{n.title}</span>
                                    </div>
                                    <p className="text-gray-700">{n.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(n.created_at).toLocaleString()}
                                    </p>
                                </div>
                                {!n.is_read && (
                                    <span className="mt-2 sm:mt-0 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                                        New
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <button
                    className="mt-8 w-full bg-[var(--accent)] text-white font-semibold py-2 rounded-lg hover-gradient transition"
                    onClick={() => router.push("/")}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}