"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePasswordPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const passwordSchema = Yup.object().shape({
        old_password: Yup.string()
            .required("Current password is required"),
        new_password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .test("has-lowercase", "Password must contain at least one lowercase letter", (value) =>
                /[a-z]/.test(value || "")
            )
            .test("has-uppercase", "Password must contain at least one uppercase letter", (value) =>
                /[A-Z]/.test(value || "")
            )
            .test("has-number", "Password must contain at least one number", (value) =>
                /\d/.test(value || "")
            )
            .test("has-special", "Password must contain at least one special character (@$!%*?&)", (value) =>
                /[@$!%*?&]/.test(value || "")
            )
            .notOneOf([Yup.ref("old_password")], "New password must be different from current password"),
    });

    const handleSubmit = async (values) => {
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to change your password.");
            return;
        }

        setLoading(true);
        try {
            const response = await secureApiCall({
                endpoint: "/api/auth/changepassword",
                data: {
                    old_password: values.old_password,
                    new_password: values.new_password,
                },
                token,
                requiresAuth: true,
            });

            toast(response.message || "Password change response", {
                type: response.code === "1" ? "success" : "error",
                position: "top-center",
            });

            if (response.code === "1") {
                setTimeout(() => router.push("/profile"), 1000);
            }
        } catch (error) {
            console.error("Password change error:", error);
            toast.error("An error occurred while changing password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-6">
            <ToastContainer theme="light" />
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-cool border border-[var(--accent)]">
                <h2 className="text-2xl font-bold text-[var(--accent)] mb-6 text-center">Change Password</h2>

                <Formik
                    initialValues={{
                        old_password: "",
                        new_password: "",
                    }}
                    validationSchema={passwordSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isValid }) => (
                        <Form className="space-y-5">
                            <div>
                                <label htmlFor="old_password" className="block mb-1 font-medium">
                                    Current Password
                                </label>
                                <Field
                                    name="old_password"
                                    type="password"
                                    className="w-full px-4 py-2 bg-white border border-[var(--border)] rounded focus:ring-[var(--accent)]"
                                    placeholder="Enter your current password"
                                />
                                <ErrorMessage
                                    name="old_password"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label htmlFor="new_password" className="block mb-1 font-medium">
                                    New Password
                                </label>
                                <Field
                                    name="new_password"
                                    type="password"
                                    className="w-full px-4 py-2 bg-white border border-[var(--border)] rounded focus:ring-[var(--accent)]"
                                    placeholder="Enter new password"
                                />
                                <ErrorMessage
                                    name="new_password"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={!isValid || loading}
                                    className="flex-1 bg-[var(--accent)] text-white font-semibold py-2 rounded-lg hover-gradient transition disabled:opacity-50"
                                >
                                    {loading ? "Changing..." : "Change Password"}
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
            </div>
        </div>
    );
}