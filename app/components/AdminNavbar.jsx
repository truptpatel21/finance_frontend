"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { encrypt, decrypt } from "@/utils/encdec";

export default function AdminNavbar() {
    const router = useRouter();

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
                        token,
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
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-2xl font-bold text-blue-700 tracking-tight">Finance Admin</span>
                </div>
                <div className="flex items-center gap-2">
                    
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}