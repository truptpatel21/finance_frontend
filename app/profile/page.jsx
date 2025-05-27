"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async () => {
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to view your profile.");
            setLoading(false);
            return;
        }

        try {
            const response = await secureApiCall({
                endpoint: "/api/users/me",
                data: "",
                token,
                requiresAuth: true,
            });

            if (response.code === "1") {
                setUserDetails({
                    name: response.data.user.name || "",
                    email: response.data.user.email || "",
                    address: response.data.user.address || "",
                });
            } else {
                toast.error(response.message || "Failed to fetch profile.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("An error occurred while fetching profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-6">
            <ToastContainer theme="light" />
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-cool border border-[var(--accent)]">
                <h2 className="text-3xl font-bold text-[var(--accent)] mb-8 text-center tracking-wide">My Profile</h2>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : userDetails ? (
                    <div className="space-y-8">
                        <div className="bg-[var(--highlight)] p-6 rounded-xl border border-[var(--border)]">
                            <h3 className="text-xl font-semibold text-[var(--accent)] mb-4">User Details</h3>
                            <div className="space-y-2 text-lg">
                                <p>
                                    <span className="font-semibold text-[var(--secondary)]">Email:</span>{" "}
                                    <span className="text-[var(--foreground)]">{userDetails.email}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-[var(--secondary)]">Name:</span>{" "}
                                    <span className="text-[var(--foreground)]">{userDetails.name}</span>
                                </p>
                                <p>
                                    <span className="font-semibold text-[var(--secondary)]">Address:</span>{" "}
                                    <span className="text-[var(--foreground)]">{userDetails.address}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <button
                                onClick={() => handleNavigation("/profile/update")}
                                className="w-full bg-[var(--accent)] text-white font-semibold py-2 rounded-lg hover-gradient transition"
                            >
                                Update Profile
                            </button>
                            <button
                                onClick={() => handleNavigation("/profile/change-password")}
                                className="w-full bg-[var(--highlight)] text-[var(--accent)] font-semibold py-2 rounded-lg border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-red-500">No profile data found.</div>
                )}
            </div>
        </div>
    );
}