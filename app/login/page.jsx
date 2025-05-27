"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { secureApiCall } from "@/utils/api";
import { decrypt } from "@/utils/encdec";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await secureApiCall({
        endpoint: "/api/auth/login",
        data: values,
        requiresAuth: false,
      });

      if (response.code !== "1") {
        toast.error(response.message || "No message from backend", {
          position: "top-center",
          autoClose: 2000,
        });
      }

      if (response.code === "1" && response?.data?.encryptedjwt) {
        const encryptedJwt = response.data.encryptedjwt;
        Cookies.set("token", encryptedJwt, { path: "/" });

        const decryptedJwtWrapper = JSON.parse(decrypt(encryptedJwt));
        const plainJwt = decryptedJwtWrapper.jwt;
        const payloadBase64 = plainJwt.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);

        const role = payload.role === "admin" ? "admin" : "user";
        Cookies.set("user", role, { path: "/" });

        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful`, {
          position: "top-center",
          autoClose: 2000,
        });

        resetForm();
        setTimeout(() => {
          router.push(role === "admin" ? "/admin" : "/");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <ToastContainer theme="light" />
      {loading && (
        <div className="fixed inset-0 bg-[var(--background)]/80 flex items-center justify-center z-50">
          <div className="h-12 w-12 border-4 border-t-transparent border-[var(--accent)] rounded-full animate-spin" />
        </div>
      )}
      <div className="w-full max-w-md bg-[var(--background)] shadow-cool p-8 rounded-xl">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2 text-center">Login</h2>
        <p className="text-center text-[var(--secondary)] mb-6">Welcome back! Please login to your account</p>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form className="space-y-5">
              {["email", "password"].map((field) => (
                <div key={field} className="relative">
                  <label htmlFor={field} className="block text-[var(--foreground)] text-sm font-medium capitalize mb-1">
                    {field === "password" ? "Password" : "Email"}
                  </label>
                  <div className="relative flex items-center">
                    <Field
                      id={field}
                      name={field}
                      type={field === "password" ? (showPassword ? "text" : "password") : "email"}
                      placeholder={`Enter ${field}`}
                      className="w-full px-4 py-2.5 bg-white text-[var(--foreground)] border-cool focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-50 placeholder-[var(--secondary)]"
                    />
                    {field === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 px-2 py-1 text-sm text-[var(--secondary)] bg-[var(--accent)] rounded-md hover-gradient focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? "🙈" : "🙉"}
                      </button>
                    )}
                  </div>
                  <ErrorMessage
                    name={field}
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full bg-[var(--accent)] text-white font-semibold py-3 hover-gradient disabled:opacity-50 rounded-xl"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <Link
                href="/signup"
                className="block text-center mt-4 text-[var(--secondary)] hover:text-[var(--accent)] text-sm"
              >
                Don’t have an account? Signup here
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}