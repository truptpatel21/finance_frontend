"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { encrypt, decrypt } from "@/utils/encdec";

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkToken = () => {
            const token = Cookies.get("token");
            setIsLoggedIn(!!token);
        };
        checkToken();
        const interval = setInterval(checkToken, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        const token = Cookies.get("token");
        if (!token) {
            toast.error("No token found to logout.");
            return;
        }
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/logout`,
                "",
                {
                    headers: {
                        "Content-Type": "text/plain",
                        "Accept-Language": "en",
                        "api-key": encrypt(process.env.NEXT_API_KEY || "nodenextapikey123"),
                        token: token,
                    },
                }
            );
            const decryptedRes = typeof res.data === "string" ? JSON.parse(decrypt(res.data)) : res.data;
            toast(decryptedRes.message || "Logged out", {
                type: decryptedRes.code === "1" ? "success" : "error",
                position: "top-center",
                autoClose: 2000,
            });
            Cookies.remove("token", { path: "/" });
            setIsLoggedIn(false);
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    return (
        <nav className="bg-white shadow-cool rounded-b-xl px-4 py-3 mb-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link
                    href="/"
                    className="text-2xl font-bold text-[var(--foreground)] tracking-tight"
                    style={{ letterSpacing: "0.01em" }}
                >
                    Finance Manager
                </Link>
                <div className="flex gap-2 items-center">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--highlight)] transition"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/profile"
                                className="px-4 py-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--highlight)] transition"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold hover-gradient transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--highlight)] transition"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold hover-gradient transition"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}