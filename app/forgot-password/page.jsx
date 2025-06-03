// pages/forgot-password.js
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
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded w-96">
                <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                    Send Reset Link
                </button>
            </form>
        </div>
    );
}
