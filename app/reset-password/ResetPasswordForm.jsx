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
        <div className="min-h-screen flex justify-center items-center">
            <ToastContainer />
            <div className="p-8 shadow bg-white rounded w-96">
                <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
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
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <ErrorMessage name="newPassword" component="div" className="text-sm text-red-500 mt-1" />
                            </div>
                            <div className="mb-4">
                                <Field
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500 mt-1" />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white w-full py-2 rounded"
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