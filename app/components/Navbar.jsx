"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { encrypt, decrypt } from "@/utils/encdec";

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            toast.error("No token found to logout.", {
                position: "top-center",
                autoClose: 2000,
            });
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

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-gradient-to-r from-blue-50 via-teal-50 to-purple-100 shadow-lg rounded-b-xl px-4 py-3 mb-6 sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link
                    href="/"
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-purple-500 bg-clip-text text-transparent tracking-tight hover:scale-105 transition-transform duration-200"
                    style={{ letterSpacing: "0.01em" }}
                >
                    Financyy
                </Link>
                <div className="hidden md:flex gap-2 items-center">
                    <Link
                        href="/financyy/about"
                        className="px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                    >
                        About
                    </Link>

                    <Link
                        href="/financyy/blogs"
                        className="px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                    >
                        Blog
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/profile"
                                className="px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-teal-500 hover:scale-105 transition-all duration-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg text-blue-700 hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white font-semibold hover:from-teal-400 hover:to-blue-600 hover:scale-105 transition-all duration-200"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-blue-700 focus:outline-none"
                    >
                        <svg
                            className="h-8 w-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden mt-4 bg-white/95 rounded-lg shadow-xl p-4 animate-slide-down">
                    <Link
                        href="/financyy/about"
                        className="block px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-lg"
                        onClick={toggleMenu}
                    >
                        About
                    </Link>

                    <Link
                        href="/financyy/blogs"
                        className="block px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-lg"
                        onClick={toggleMenu}
                    >
                        Blog
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="block px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-lg"
                                onClick={toggleMenu}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-lg"
                                onClick={toggleMenu}
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    toggleMenu();
                                }}
                                className="w-full text-left px-4 py-2 text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-teal-500"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="block px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-lg"
                                onClick={toggleMenu}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="block px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-teal-400 rounded-lg hover:from-teal-400 hover:to-blue-600"
                                onClick={toggleMenu}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
            <ToastContainer position="top-center" autoClose={2000} />
        </nav>
    );
}