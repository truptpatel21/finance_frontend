"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateProfilePage() {
    const [initialValues, setInitialValues] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async () => {
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to update your profile.");
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
                setInitialValues({
                    name: response.data.user.name || "",
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

    const profileSchema = Yup.object().shape({
        name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
        address: Yup.string().required("Address is required"),
    });

    const handleSubmit = async (values) => {
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to update your profile.");
            return;
        }

        try {
            const response = await secureApiCall({
                endpoint: "/api/users/me/update",
                data: values,
                token,
                requiresAuth: true,
            });

            toast(response.message || "Profile update response", {
                type: response.code === "1" ? "success" : "error",
                position: "top-center",
            });

            if (response.code === "1") {
                setTimeout(() => router.push("/profile"), 1000);
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred while updating profile.");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-6">
            <ToastContainer theme="light" />
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-cool border border-[var(--accent)]">
                <h2 className="text-2xl font-bold text-[var(--accent)] mb-6 text-center">Update Profile</h2>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : initialValues ? (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={profileSchema}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ isValid }) => (
                            <Form className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block mb-1 font-medium">
                                        Name
                                    </label>
                                    <Field
                                        name="name"
                                        type="text"
                                        className="w-full px-4 py-2 bg-white border border-[var(--border)] rounded focus:ring-[var(--accent)]"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block mb-1 font-medium">
                                        Address
                                    </label>
                                    <Field
                                        name="address"
                                        type="text"
                                        className="w-full px-4 py-2 bg-white border border-[var(--border)] rounded focus:ring-[var(--accent)]"
                                    />
                                    <ErrorMessage
                                        name="address"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={!isValid}
                                        className="flex-1 bg-[var(--accent)] text-white font-semibold py-2 rounded-lg hover-gradient transition disabled:opacity-50"
                                    >
                                        Update Profile
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/profile")}
                                        className="flex-1 bg-[var(--highlight)] text-[var(--accent)] font-semibold py-2 rounded-lg border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <div className="text-center text-red-500">No profile data found.</div>
                )}
            </div>
        </div>
    );
}