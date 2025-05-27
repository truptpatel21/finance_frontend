"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name cannot exceed 255 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
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
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    address: Yup.string().nullable(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const { confirmPassword, ...submitValues } = values;

    try {
      const response = await secureApiCall({
        endpoint: "/api/auth/register",
        data: submitValues,
        requiresAuth: false,
      });

      toast(response.message || "No message from backend", {
        type: response.code === "1" ? "success" : "error",
        position: "top-center",
        autoClose: 2000,
      });

      if (response.code === "1" && response?.data?.encryptedjwt) {
        Cookies.set("token", response.data.encryptedjwt, { path: "/" });
        Cookies.set("user", "user", { path: "/" });
        setTimeout(() => router.push("/"), 1000);
        resetForm();
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred.", {
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
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2 text-center">Create Your Account</h2>
        <p className="text-center text-[var(--secondary)] mb-6">Join us to manage your finances with ease</p>
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "", address: "" }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form className="space-y-5">
              {["name", "email", "password", "confirmPassword", "address"].map((field) => (
                <div key={field} className="relative">
                  <label htmlFor={field} className="block text-[var(--foreground)] text-sm font-medium capitalize mb-1">
                    {field === "confirmPassword" ? "Confirm Password" : field}
                  </label>
                  <div className="relative flex items-center">
                    <Field
                      id={field}
                      name={field}
                      type={
                        field === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : field === "confirmPassword"
                            ? showConfirmPassword
                              ? "text"
                              : "password"
                            : "text"
                      }
                      placeholder={`Enter ${field === "confirmPassword" ? "confirm password" : field}`}
                      className="w-full px-4 py-2.5 bg-white text-[var(--foreground)] border-cool focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-50 placeholder-[var(--secondary)]"
                    />
                    {(field === "password" || field === "confirmPassword") && (
                      <button
                        type="button"
                        onClick={() =>
                          field === "password"
                            ? setShowPassword(!showPassword)
                            : setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="ml-2 px-2 py-1 text-sm text-[var(--secondary)] bg-white border-cool hover-gradient focus:outline-none"
                      >
                        {field === "password" ? (showPassword ? "🙈" : "🙉") : (showConfirmPassword ? "🙈" : "🙉")}
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
                {loading ? "Submitting..." : "Sign Up"}
              </button>
              <p className="text-center text-[var(--secondary)] text-sm mt-4">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  Login here
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}