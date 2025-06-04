"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const passwordSchema = Yup.object().shape({
    newPassword: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
});

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const res = await secureApiCall({
            endpoint: "/api/auth/reset-password",
            data: { token, new_password: values.newPassword },
            requiresAuth: false,
        });

        toast[res.code === 1 ? "success" : "error"](res.message);
        if (res.code === 1) {
            setTimeout(() => router.push("/login"), 2000);
            resetForm();
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e] relative overflow-hidden">
            {/* Decorative blurred circles */}
            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-400 opacity-30 rounded-full blur-3xl z-0"></div>
            <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-400 opacity-30 rounded-full blur-3xl z-0"></div>
            <ToastContainer />
            <div className="w-full max-w-md bg-white/20 backdrop-blur-lg shadow-2xl p-8 rounded-2xl border border-white/30 z-10">
                <h2 className="text-2xl font-bold text-white mb-4 text-center drop-shadow">Reset Password</h2>
                <Formik
                    initialValues={{ newPassword: "", confirmPassword: "" }}
                    validationSchema={passwordSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, isValid }) => (
                        <Form>
                            <div className="mb-4">
                                <Field
                                    type="password"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    className="w-full px-4 py-2.5 bg-white/80 text-[var(--foreground)] border-cool focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-50 placeholder-[var(--secondary)] rounded"
                                />
                                <ErrorMessage name="newPassword" component="div" className="text-sm text-red-200 mt-1" />
                            </div>
                            <div className="mb-4">
                                <Field
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    className="w-full px-4 py-2.5 bg-white/80 text-[var(--foreground)] border-cool focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-50 placeholder-[var(--secondary)] rounded"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-200 mt-1" />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[var(--accent)] text-white font-semibold py-3 hover-gradient disabled:opacity-50 rounded-xl shadow-lg"
                                disabled={isSubmitting || !isValid}
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}