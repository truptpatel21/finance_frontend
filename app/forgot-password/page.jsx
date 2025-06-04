"use client";
import { useState } from "react";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await secureApiCall({
            endpoint: "/api/auth/forgot-password",
            data: { email },
            requiresAuth: false,
        });
        toast[res.code === 1 ? "success" : "error"](res.message, { autoClose: 3000 });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e] relative overflow-hidden">
            {/* Decorative blurred circles */}
            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-400 opacity-30 rounded-full blur-3xl z-0"></div>
            <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-400 opacity-30 rounded-full blur-3xl z-0"></div>
            <ToastContainer />
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/20 backdrop-blur-lg shadow-2xl p-8 rounded-2xl border border-white/30 z-10">
                <h2 className="text-2xl font-bold text-white mb-4 text-center drop-shadow">Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-2.5 bg-white/80 text-[var(--foreground)] border-cool focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-50 placeholder-[var(--secondary)] rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-[var(--accent)] text-white font-semibold py-3 hover-gradient disabled:opacity-50 rounded-xl shadow-lg"
                >
                    Send Reset Link
                </button>
                <p className="mt-4 text-center text-white/80">
                    Remembered your password? <a href="/login" className="text-[var(--accent)] hover:underline">Login</a>
                </p>
            </form>
        </div>
    );
}