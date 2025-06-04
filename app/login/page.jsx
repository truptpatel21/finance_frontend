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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e] relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-400 opacity-30 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-400 opacity-30 rounded-full blur-3xl z-0"></div>
      <ToastContainer theme="light" />
      {loading && (
        <div className="fixed inset-0 bg-[var(--background)]/80 flex items-center justify-center z-50">
          <div className="h-12 w-12 border-4 border-t-transparent border-[var(--accent)] rounded-full animate-spin" />
        </div>
      )}
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg shadow-2xl p-8 rounded-2xl border border-white/30 z-10">
        <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow">Login</h2>
        <p className="text-center text-white/80 mb-6">Welcome back! Please login to your account</p>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form className="space-y-5">
              {["email", "password"].map((field) => (
                <div key={field} className="relative">
                  <label htmlFor={field} className="block text-white/90 text-sm font-medium capitalize mb-1">
                    {field === "password" ? "Password" : "Email"}
                  </label>
                  <div className="relative flex items-center">
                    <Field
                      id={field}
                      name={field}
                      type={field === "password" ? (showPassword ? "text" : "password") : "email"}
                      placeholder={`Enter ${field}`}
                      className="w-full px-4 py-2.5 bg-white/80 text-[var(--foreground)] border-cool focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-50 placeholder-[var(--secondary)] rounded"
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
                    className="text-sm text-red-200 mt-1"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full bg-[var(--accent)] text-white font-semibold py-3 hover-gradient disabled:opacity-50 rounded-xl shadow-lg"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <Link href="/forgot-password" className="block text-center text-sm text-[var(--accent)] mt-2 hover:underline">
                Forgot Password?
              </Link>

              <Link
                href="/signup"
                className="block text-center mt-4 text-white/80 hover:text-[var(--accent)] text-sm"
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