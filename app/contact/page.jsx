"use client";
import { useState } from "react";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format";
        if (!form.message.trim()) newErrors.message = "Message is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Clear error for field when user starts typing
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill out all required fields correctly.");
            return;
        }
        setLoading(true);
        const res = await secureApiCall({
            endpoint: "/api/contact",
            method: "POST",
            data: form,
            requiresAuth: false,
        });
        setLoading(false);
        if (res.success || res.code === "1" || res.code === 1) {
            toast.success("Contact Request Submitted! We'll get back to you soon.");
            setForm({ name: "", email: "", phone: "", message: "" });
            setTimeout(() => router.push("/dashboard"), 2000);
        } else {
            toast.error(res.message || res.messages || "Failed to send message.");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 flex items-center justify-center p-6">
            <form
                className="bg-white/95 rounded-2xl shadow-2xl p-10 max-w-lg w-full space-y-6"
                onSubmit={handleSubmit}
            >
                <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Contact Us</h1>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Your Name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="you@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Phone (Optional)</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Your Phone Number"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Message</label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                        rows={5}
                        placeholder="How can we help you?"
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Sending...
                        </>
                    ) : (
                        "Send Message"
                    )}
                </button>
            </form>
            <ToastContainer />
        </main>
    );
}