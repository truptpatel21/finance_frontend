"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Simple Error Boundary Component
function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error rendering component: {error.message}
      </div>
    );
  }
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [budgetUtilization, setBudgetUtilization] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [upcomingRecurring, setUpcomingRecurring] = useState([]);
  const [cashFlow, setCashFlow] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [notifications, setNotifications] = useState([]);

  const debouncedYear = useDebounce(year, 500);
  const debouncedMonth = useDebounce(month, 500);

  const token = Cookies.get("token");

  // Chart references for cleanup
  const summaryChartRef = useRef(null);
  const categoryChartRef = useRef(null);

  // Fetch all dashboard data on mount or when debounced year/month changes
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAllData();

    return () => {
      // Ensure chart cleanup on unmount
      if (summaryChartRef.current?.chartInstance) {
        summaryChartRef.current.chartInstance.destroy();
        summaryChartRef.current.chartInstance = null;
      }
      if (categoryChartRef.current?.chartInstance) {
        categoryChartRef.current.chartInstance.destroy();
        categoryChartRef.current.chartInstance = null;
      }
    };
    // eslint-disable-next-line
  }, [debouncedYear, debouncedMonth, token]); // Added token to dependencies


  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProfile(),
        fetchSummary(),
        fetchBudget(),
        fetchCategories(),
        fetchGoals(),
        fetchUpcomingRecurring(),
        fetchCashFlow(),
        fetchNotifications(),
      ]);
    } catch (error) {
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await secureApiCall({
        endpoint: "/api/users/me",
        data: {},
        token,
        requiresAuth: true,
      });
      setUserProfile(res.code === "1" ? res.data : null);
    } catch {
      setUserProfile(null);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await secureApiCall({
        endpoint: "/api/summary/monthly",
        data: { year: debouncedYear, month: debouncedMonth },
        token,
        requiresAuth: true,
      });
      setMonthlySummary(res.code === "1" && res.data ? res.data : null);
    } catch {
      setMonthlySummary(null);
    }
  };

  const fetchBudget = async () => {
    try {
      const res = await secureApiCall({
        endpoint: "/api/budget/utilization",
        data: { year: debouncedYear, month: debouncedMonth },
        token,
        requiresAuth: true,
      });
      setBudgetUtilization(res.code === "1" ? res.data : []);
    } catch {
      setBudgetUtilization([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const startDate = `${debouncedYear}-${debouncedMonth.toString().padStart(2, "0")}-01`;
      const endDate = `${debouncedYear}-${debouncedMonth.toString().padStart(2, "0")}-31`;
      const res = await secureApiCall({
        endpoint: "/api/analytics/top-categories",
        data: { start_date: startDate, end_date: endDate },
        token,
        requiresAuth: true,
      });
      setTopCategories(res.code === "1" ? res.data : []);
    } catch {
      setTopCategories([]);
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await secureApiCall({
        endpoint: "/api/goals/progress",
        data: { year: debouncedYear, month: debouncedMonth },
        token,
        requiresAuth: true,
      });
      setGoals(res.code === "1" ? res.data : []);
    } catch {
      setGoals([]);
    }
  };

  const fetchUpcomingRecurring = async () => {
    try {
      const res = await secureApiCall({
        endpoint: "/api/recurring/upcoming",
        data: { year: debouncedYear, month: debouncedMonth },
        token,
        requiresAuth: true,
      });
      setUpcomingRecurring(res.code === "1" ? res.data : []);
    } catch {
      setUpcomingRecurring([]);
    }
  };

  const fetchCashFlow = async () => {
    try {
      const res = await secureApiCall({
        endpoint: "/api/cashflow",
        data: {},
        token,
        requiresAuth: true,
      });
      setCashFlow(res.code === "1" ? res.data : null);
    } catch {
      setCashFlow(null);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await secureApiCall({
        endpoint: "/api/notification/list",
        data: {},
        token,
        requiresAuth: true,
      });
      setNotifications(res.code === "1" ? res.data : []);
    } catch {
      setNotifications([]);
    }
  };

  // Quick action navigation
  const goTo = useCallback((path) => router.push(path), [router]);

  // Chart data for Monthly Summary
  const summaryChartData = {
    labels: ["Income", "Expense", "Savings"],
    datasets: [{
      data: [
        monthlySummary?.total_income || 0,
        monthlySummary?.total_expense || 0,
        monthlySummary?.savings || 0,
      ],
      backgroundColor: ["#34D399", "#F87171", "#60A5FA"],
      borderColor: ["#fff", "#fff", "#fff"],
      borderWidth: 1,
    }],
  };

  // Chart data for Top Categories
  const categoryChartData = {
    labels: topCategories.map((cat) => cat.category),
    datasets: [{
      data: topCategories.map((cat) => Number(cat.total_spent || 0)),
      backgroundColor: ["#60A5FA", "#34D399", "#F87171", "#FBBF24", "#A78BFA"],
      borderColor: ["#fff"],
      borderWidth: 1,
    }],
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <style jsx global>{`
      :root {
        --background: #F3F4F6;
        --foreground: #1F2937;
        --accent: #3B82F6;
        --secondary: #6B7280;
        --highlight: #E5E7EB;
        --border: #D1D5DB;
        --glass-bg: rgba(255, 255, 255, 0.8);
        --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
      }

      /* Glassmorphism Card Styling */
      .card-glass {
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        box-shadow: var(--glass-shadow);
        transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
      }

      .card-glass:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        background: rgba(255, 255, 255, 0.9);
      }

      /* Hover Gradient for Buttons */
      .hover-gradient {
        background: linear-gradient(to right, #3B82F6, #2563EB);
        transition: background 0.3s ease, transform 0.2s ease;
      }

      .hover-gradient:hover {
        background: linear-gradient(to right, #2563EB, #1D4ED8);
        transform: scale(1.05);
      }

      /* Border Styling for Inputs */
      .border-cool {
        border: 1px solid var(--border);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .border-cool:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        outline: none;
      }

      /* Progress Bar Animation */
      .progress-bar {
        transition: width 1.5s ease-in-out, background-color 0.3s ease;
      }

      /* Skeleton Loading Animation */
      .skeleton {
        background: linear-gradient(90deg, #e5e7eb 25%, #d1d5db 50%, #e5e7eb 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
      }

      @keyframes skeleton-loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* Section Separator */
      .section-divider {
        position: relative;
        height: 2px;
        background: linear-gradient(to right, transparent, var(--border), transparent);
        margin: 2rem 0;
      }

      .section-divider::before {
        content: "•";
        position: absolute;
        left: 50%;
        top: -10px;
        transform: translateX(-50%);
        color: var(--accent);
        font-size: 1.5rem;
      }

      /* Smooth Scroll Behavior */
      html {
        scroll-behavior: smooth;
      }
    `}</style>

      <ToastContainer theme="light" />
      <ReactTooltip id="dashboard-tooltip" place="top" effect="solid" />

      {loading && (
        <motion.div
          className="fixed inset-0 bg-gray-100/90 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-12 w-12 border-4 border-t-blue-500 border-gray-300 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Welcome Banner */}
        <motion.div
          className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg flex items-center justify-between"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {userProfile?.user?.name || "User"}   !!!
          </h1>
          {notifications.length > 0 && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <button
                onClick={() => goTo("/notifications")}
                className="p-2 relative"
                data-tooltip-id="dashboard-tooltip"
                data-tooltip-content="View Notifications"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {notifications.filter((n) => !n.is_read).length}
                </span>
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Month/Year Selector */}
        <motion.div
          className="mb-12 flex gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2 bg-white text-gray-900 border-cool rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm"
          >
            {[...Array(5)].map((_, i) => (
              <option key={i} value={new Date().getFullYear() - 2 + i}>
                {new Date().getFullYear() - 2 + i}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-4 py-2 bg-white text-gray-900 border-cool rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Dashboard Sections - Step-wise Layout */}
        <div className="flex flex-col gap-8">
          {/* Monthly Summary */}
          <motion.div
            className="card-glass p-6"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-blue-600">Monthly Summary</h2>
              </div>
              <motion.button
                onClick={() => goTo("/transactions")}
                className="text-sm text-blue-500 hover:underline"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Add Transaction
              </motion.button>
            </div>
            <div className="relative">
              {loading && (
                <motion.div
                  className="absolute inset-0 bg-white/80 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-12 w-12 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
                </motion.div>
              )}
              {monthlySummary && monthlySummary.total_income !== null ? (
                <ErrorBoundary>
                  <div className="space-y-6">
                    <div className="h-64">
                      <Bar
                        key={`${debouncedYear}-${debouncedMonth}`}
                        data={summaryChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: (context) => `₹${context.parsed.y.toFixed(2)} `,
                              },
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: { callback: (value) => `₹${value} ` },
                            },
                          },
                          animation: {
                            duration: 1000,
                            easing: "easeOutQuart",
                          },
                        }}
                        ref={(el) => {
                          summaryChartRef.current = el;
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <motion.div
                        className="p-4 bg-gray-50 rounded-lg"
                        whileHover={{ scale: 1.03 }}
                        data-tooltip-id="dashboard-tooltip"
                        data-tooltip-content="Total income for the selected period"
                      >
                        <p className="text-sm text-gray-500">Total Income</p>
                        <p className="text-xl font-bold text-green-600">
                          ₹{Number(monthlySummary.total_income || 0).toFixed(2)}
                        </p>
                      </motion.div>
                      <motion.div
                        className="p-4 bg-gray-50 rounded-lg"
                        whileHover={{ scale: 1.03 }}
                        data-tooltip-id="dashboard-tooltip"
                        data-tooltip-content="Total expenses for the selected period"
                      >
                        <p className="text-sm text-gray-500">Total Expense</p>
                        <p className="text-xl font-bold text-red-500">
                          ₹{Number(monthlySummary.total_expense || 0).toFixed(2)}
                        </p>
                      </motion.div>
                      <motion.div
                        className="p-4 bg-gray-50 rounded-lg"
                        whileHover={{ scale: 1.03 }}
                        data-tooltip-id="dashboard-tooltip"
                        data-tooltip-content="Net savings for the selected period"
                      >
                        <p className="text-sm text-gray-500">Savings</p>
                        <p
                          className={`text-xl font-bold ${Number(monthlySummary.savings || 0) >= 0 ? "text-blue-600" : "text-red-500"
                            }`}
                        >
                          ₹{Number(monthlySummary.savings || 0).toFixed(2)}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </ErrorBoundary>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-blue-500">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M9 12h6M9 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p className="text-gray-500">No summary data found for this date.</p>
                  <motion.button
                    onClick={() => goTo("/transactions")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover-gradient"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Add Transactions
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          <div className="section-divider" />

          {/* Budget Utilization */}
          <motion.div
            className="card-glass p-6"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-blue-600">Budget Utilization</h2>
              </div>
              <motion.button
                onClick={() => goTo("/budgets")}
                className="text-sm text-blue-500 hover:underline"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                View Details
              </motion.button>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-4 skeleton rounded-lg h-24" />
                ))}
              </div>
            ) : budgetUtilization.length > 0 ? (
              <div className="space-y-4">
                {budgetUtilization.map((budget) => (
                  <motion.div
                    key={budget.id}
                    className="p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between"
                    whileHover={{ scale: 1.02 }}
                    data-tooltip-id="dashboard-tooltip"
                    data-tooltip-content={`Remaining: ₹${(
                      Number(budget.budget_amount || 0) - Number(budget.spent || 0)
                    ).toFixed(2)}`}
                  >
                    <div>
                      <p className="text-sm text-gray-500">Monthly Budget</p>
                      {budget.warning && <p className="text-sm text-red-500 mt-1">{budget.warning}</p>}
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end">
                      <span className="text-blue-600 font-semibold">
                        Target: ₹{Number(budget.budget_amount || 0).toFixed(2)}
                      </span>
                      <div className="relative w-full sm:w-48 bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                        <motion.div
                          key={`${budget.id}-${year}-${month}`}
                          className={`h-3 rounded-full progress-bar ${budget.utilization_percent > 100
                            ? "bg-red-500"
                            : budget.utilization_percent > 80
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                            }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(Number(budget.utilization_percent || 0), 100)}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Spent: ₹{Number(budget.spent || 0).toFixed(2)} (
                        {Number(budget.utilization_percent || 0).toFixed(1)}%)
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-blue-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M9 12h6M9 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-gray-500">No budget data found for this date.</p>
                <motion.button
                  onClick={() => goTo("/budgets")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover-gradient"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Set Budget
                </motion.button>
              </div>
            )}
          </motion.div>

          <div className="section-divider" />

          {/* Top Spending Categories */}
          <motion.div
            className="card-glass p-6"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-blue-600">Top Spending Categories</h2>
              </div>
              <motion.button
                onClick={() => goTo("/spends")}
                className="text-sm text-blue-500 hover:underline"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                View Top spends
              </motion.button>
            </div>
            {loading ? (
              <div className="space-y-4">
                <div className="h-64 skeleton rounded-lg" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 skeleton rounded-lg h-16" />
                ))}
              </div>
            ) : topCategories.length > 0 ? (
              <div className="space-y-6">
                <div className="h-64">
                  <ErrorBoundary>
                    <Doughnut
                      data={categoryChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: "bottom" },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const total = topCategories.reduce(
                                  (sum, c) => sum + Number(c.total_spent || 0),
                                  0
                                );
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ₹${context.parsed.toFixed(2)} (${percentage}%)`;
                              },
                            },
                          },
                        },
                        animation: {
                          duration: 1000,
                          easing: "easeOutQuart",
                        },
                      }}
                      ref={categoryChartRef}
                    />
                  </ErrorBoundary>
                </div>
                <div className="space-y-2">
                  {topCategories
                    .sort((a, b) => Number(b.total_spent || 0) - Number(a.total_spent || 0))
                    .map((category, idx) => (
                      <motion.div
                        key={category.category + "-" + idx}
                        className="p-3 bg-gray-50 rounded"
                        whileHover={{ scale: 1.02 }}
                        data-tooltip-id="dashboard-tooltip"
                        data-tooltip-content={`Spending: ₹${Number(category.total_spent || 0).toFixed(2)}`}
                      >
                        <div>
                          <p className="text-sm text-gray-600">{category.category}</p>
                          <p className="text-lg font-semibold text-gray-800">
                            ₹{Number(category.total_spent || 0).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {(
                              (category.total_spent /
                                topCategories.reduce(
                                  (sum, c) => sum + Number(c.total_spent || 0),
                                  0
                                )) *
                              100
                            ).toFixed(1)}
                            % of total
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-blue-600">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M9 12h6M9 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-gray-600">No spending data found for this period.</p>
                <motion.button
                  onClick={() => goTo("/transactions")}
                  className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover-gradient"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Add Transactions
                </motion.button>
              </div>
            )}
          </motion.div>

          <div className="section-divider" />

          {/* Upcoming Recurring Transactions */}
          <motion.div
            className="card-glass p-6"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke="round"
                    strokeWidth="2"
                    d="M8 7v-4M16 7v-4M7 11h10M5 21h14a2 2 0 002-2V7a2-2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-blue-600">Upcoming Recurring Transactions</h2>
              </div>
              <motion.button
                onClick={() => goTo("/recurring")}
                className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover-gradient"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                View Details
              </motion.button>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 skeleton rounded-lg h-20" />
                ))}
              </div>
            ) : upcomingRecurring.length > 0 ? (
              <div className="space-y-4">
                {upcomingRecurring.map((rec, idx) => {
                  const category = topCategories.find(
                    (cat) => cat.category_id === rec.category_id || cat.id === rec.category_id
                  );
                  const type = category?.type;
                  return (
                    <motion.div
                      key={rec.id || idx}
                      className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                      whileHover={{ scale: 1.02 }}
                      data-tooltip-id="tooltip"
                      data-tooltip-content={`Due: ${new Date(rec.next_due_date).toLocaleDateString()}`}
                    >
                      <div>
                        <p className="text-sm text-gray-600">{rec.frequency} Transaction</p>
                        <p className="text-lg font-semibold text-gray-800">
                          ₹{Number(rec.amount || 0).toFixed(2)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {type === "income" ? "Income" : "Expense"}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-blue-600">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-gray-600">No upcoming recurring transactions found.</p>
                <motion.button
                  onClick={() => goTo("/recurring")}
                  className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover-gradient"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Add Recurring Transaction
                </motion.button>
              </div>
            )}
          </motion.div>

          <div className="section-divider" />

          {/* Cash Flow Forecast */}
          <motion.div
            className="card-glass p-6"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke="round"
                    strokeWidth="2"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v16M4 4l4 4"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-blue-600">Cash Flow Forecast</h2>
              </div>
              <motion.button
                onClick={() => goTo("/analytics")}
                className="text-sm font-medium text-blue-600 hover:underline"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Analytics
              </motion.button>
            </div>
            {loading ? (
              <div className="space-y-4">
                <div className="h-64 skeleton rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 skeleton rounded-lg" />
                  <div className="h-16 skeleton rounded-lg" />
                </div>
              </div>
            ) : cashFlow ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="p-4 bg-gray-50 rounded-lg"
                    whileHover={{ scale: 1.03 }}
                    data-tooltip-id="dashboard-tooltip"
                    data-tooltip-content="Expected Monthly Income"
                  >
                    <p className="text-sm text-gray-600">Recurring Expense</p>
                    <p className="text-lg font-semibold text-red-600">
                      ₹{Number(cashFlow.recurring_income || 0).toFixed(2)}
                    </p>
                  </motion.div>
                  <motion.div
                    className="p-4 bg-gray-50 rounded-lg"
                    whileHover={{ scale: 1.03 }}
                    data-tooltip-id="dashboard-tooltip"
                    data-tooltip-content="Expected Monthly Expenses"
                  >
                    <p className="text-sm text-gray-600">Recurring Income</p>
                    <p className="text-lg font-semibold text-green-600">
                      ₹{Number(cashFlow.recurring_expense || 0).toFixed(2)}
                    </p>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4 text-blue-600">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-gray-600">No cash flow data found.</p>
              </div>
            )}
          </motion.div>

          <div className="section-divider" />

          {/* Goals */}
          <motion.div
            className="card-glass p-6"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L7 7"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-blue-600">Your Goals</h2>
              </div>
              <motion.button
                onClick={() => goTo("/goals")}
                className="text-sm text-blue-500 hover:underline"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                View Details
              </motion.button>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-4 skeleton rounded-lg h-24" />
                ))}
              </div>
            ) : goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal, idx) => {
                  const rawProgressPercent =
                    goal.progress_percent !== undefined && goal.progress_percent !== null
                      ? Number(goal.progress_percent)
                      : ((goal.current_amount || 0) / (goal.target_amount || 1)) * 100;

                  const progressPercent = isNaN(rawProgressPercent) || !isFinite(rawProgressPercent)
                    ? 0
                    : Number(rawProgressPercent);
                  const isSpendingGoal = goal.type === "spending_limit";
                  const remainingDays = Math.max(
                    0,
                    Math.ceil(
                      (new Date(goal.deadline) - new Date("2025-05-27T13:39:00+05:30")) /
                      (1000 * 60 * 60 * 24)
                    )
                  );
                  const statusColor = isSpendingGoal
                    ? progressPercent > 100
                      ? "bg-red-500"
                      : progressPercent > 80
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    : progressPercent < 50 && remainingDays < 5
                      ? "bg-red-500"
                      : progressPercent < 80
                        ? "bg-yellow-500"
                        : "bg-green-500";

                  return (
                    <motion.div
                      key={goal.id || idx}
                      className="p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between"
                      whileHover={{ scale: 1.02 }}
                      data-tooltip-id="dashboard-tooltip"
                      data-tooltip-content={
                        isSpendingGoal
                          ? `Overspent by: ₹${Math.max(
                            0,
                            Number(goal.current_amount) - Number(goal.target_amount)
                          ).toFixed(2)}`
                          : `Remaining to achieve: ₹${(
                            Number(goal.target_amount) - Number(goal.current_amount)
                          ).toFixed(2)}`
                      }
                    >
                      <div>
                        <p className="text-sm text-gray-500">
                          {goal.name}:
                        </p>
                        <p className="text-sm text-gray-500">
                          Deadline: {new Date(goal.deadline).toLocaleDateString()} ({remainingDays} days remaining)
                        </p>
                        {isSpendingGoal && progressPercent > 100 && (
                          <p className="text-sm text-red-500 mt-1">Spending limit exceeded!</p>
                        )}
                        {!isSpendingGoal && progressPercent < 50 && remainingDays < 5 && (
                          <p className="text-sm text-red-500 mt-1">Behind schedule!</p>
                        )}
                      </div>
                      <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end">
                        <span className="text-blue-600 font-semibold">
                          Target: ₹{Number(goal.target_amount || 0).toFixed(2)}
                        </span>
                        <div className="relative w-full sm:w-48 min-w-[120px] bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                          <motion.div
                            key={`${goal.id || idx}-${progressPercent}`}
                            className={`h-3 rounded-full progress-bar ${statusColor}`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.max(Math.min(progressPercent, 100), 5)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-sm mt-1">
                          <span className="font-semibold text-blue-600">
                            {isSpendingGoal ? "Spent" : "Saved"}: ₹{Number(goal.current_amount || 0).toFixed(2)}
                          </span>
                          <span className="ml-1 text-gray-500">({progressPercent.toFixed(1)}%)</span>
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-blue-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M9 12h6M9 14h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-gray-500">No goals found. Start by adding a new goal!</p>
                <motion.button
                  onClick={() => goTo("/goals")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover-gradient"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Add Goal
                </motion.button>
              </div>
            )}
          </motion.div>

          <div className="section-divider" />

          {/* Quick Actions */}
          <motion.div
            className="card-glass p-6"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-blue-600">Quick Actions</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.button
                onClick={() => goTo("/transactions")}
                className="p-4 bg-blue-600 text-white rounded-lg hover-gradient"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                data-tooltip-id="dashboard-tooltip"
                data-tooltip-content="Add a new transaction"
              >
                Add Transaction
              </motion.button>
              <motion.button
                onClick={() => goTo("/budgets")}
                className="p-4 bg-blue-600 text-white rounded-lg hover-gradient"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                data-tooltip-id="dashboard-tooltip"
                data-tooltip-content="Set a new budget"
              >
                Set Budget
              </motion.button>
              <motion.button
                onClick={() => goTo("/goals")}
                className="p-4 bg-blue-600 text-white rounded-lg hover-gradient"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                data-tooltip-id="dashboard-tooltip"
                data-tooltip-content="Create a new goal"
              >
                Create Goal
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
