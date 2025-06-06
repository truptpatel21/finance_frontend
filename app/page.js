"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Home() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [expandedTip, setExpandedTip] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
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
      }
    };
    fetchProfile();
  }, [token]);

  const budgetChartData = {
    labels: ["Housing", "Food", "Transportation", "Entertainment", "Savings"],
    datasets: [{
      data: [30, 20, 15, 10, 25],
      backgroundColor: ["#2EE2C5", "#FF6B6B", "#A78BFA", "#FFD93D", "#FF9A8B"],
      borderColor: ["#fff"],
      borderWidth: 1,
    }],
  };

  const savingsChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{
      label: "Savings (₹)",
      data: [5000, 7000, 9000, 12000, 15000],
      backgroundColor: "#2EE2C5",
      borderColor: "#fff",
      borderWidth: 1,
    }],
  };

  const financeTips = [
    {
      id: 1,
      title: "5 Ways to Save More This Month",
      excerpt: "Learn simple strategies to cut expenses and boost your savings without sacrificing your lifestyle.",
      fullContent: [
        "1. **Create a Budget Plan**: Start by tracking your income and expenses to understand where your money goes each month.",
        "2. **Cut Unnecessary Subscriptions**: Review your subscriptions and cancel those you rarely use, like streaming services or gym memberships.",
        "3. **Cook at Home**: Reduce dining out and prepare meals at home to save on food expenses.",
        "4. **Use Cashback Offers**: Take advantage of cashback and rewards programs when shopping to get money back on purchases.",
        "5. **Set Savings Goals**: Allocate a portion of your income to savings each month and treat it as a non-negotiable expense."
      ],
    },
    {
      id: 2,
      title: "Understanding Your Credit Score",
      excerpt: "Discover what factors affect your credit score and how to improve it over time.",
      fullContent: [
        "1. **Payment History**: Ensure you pay all bills on time, as late payments can negatively impact your score.",
        "2. **Credit Utilization**: Keep your credit card balances below 30% of your credit limit to maintain a healthy score.",
        "3. **Length of Credit History**: The longer your credit history, the better. Avoid closing old accounts.",
        "4. **Credit Mix**: Having a mix of credit types (e.g., credit cards, loans) can positively affect your score.",
        "5. **Avoid Frequent Applications**: Applying for multiple credit lines in a short period can lower your score."
      ],
    },
    {
      id: 3,
      title: "Investing for Beginners",
      excerpt: "Get started with investing using these beginner-friendly tips to grow your wealth.",
      fullContent: [
        "1. **Start Small**: Begin with low-risk investments like mutual funds or ETFs to get comfortable.",
        "2. **Diversify Your Portfolio**: Spread your investments across different asset classes to reduce risk.",
        "3. **Learn the Basics**: Understand key terms like stocks, bonds, and dividends before investing.",
        "4. **Set Long-Term Goals**: Focus on long-term growth rather than short-term gains to build wealth.",
        "5. **Consult a Financial Advisor**: If unsure, seek advice from a professional to guide your investment journey."
      ],
    },
  ];

  const testimonials = [
    {
      quote: "This app transformed how I manage my finances! I saved ₹50,000 in just 6 months.",
      author: "Priya Sharma",
    },
    {
      quote: "The budgeting tools are so intuitive. I finally feel in control of my money.",
      author: "Amit Patel",
    },
    {
      quote: "Setting financial goals has never been easier. Highly recommend this platform!",
      author: "Rohit Kumar",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.9 },
  };

  const accordionVariants = {
    collapsed: { height: 0, opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    expanded: { height: "auto", opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const toggleTip = (id) => {
    setExpandedTip(expandedTip === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 overflow-hidden">
      <style jsx global>{`
        :root {
          --primary: #2EE2C5;
          --secondary: #FF6B6B;
          --accent: #A78BFA;
          --background: #F5F7FA;
          --glass-bg: rgba(255, 255, 255, 0.7);
          --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          --neon-glow: 0 0 20px rgba(46, 226, 197, 0.4);
          --text-dark: #1E3A8A;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='90' cy='90' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3Ccircle cx='30' cy='70' r='1'/%3E%3Ccircle cx='70' cy='30' r='1'/%3E%3C/g%3E%3C/svg%3E");
          background-color: var(--background);
        }

        .hero-gradient {
          background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%);
          position: relative;
          background-attachment: fixed;
          background-size: cover;
        }

        .hero-bg-illustration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.1;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cg fill='%231E3A8A' fill-opacity='0.3'%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3Ccircle cx='350' cy='350' r='15'/%3E%3Cpath d='M100 300 L150 250 L200 300' stroke='%231E3A8A' stroke-width='10' fill='none'/%3E%3Cpath d='M300 100 L250 150 L300 200' stroke='%231E3A8A' stroke-width='10' fill='none'/%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }

        .particle-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(30, 58, 138, 0.5);
          border-radius: 50%;
          animation: float 8s infinite ease-in-out;
        }

        .particle--teal { background: #2EE2C5; }
        .particle--coral { background: #FF6B6B; }
        .particle--violet { background: #A78BFA; }

        @keyframes float {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0.5; }
        }

        .card-glass {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: var(--glass-shadow);
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }

        .card-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid transparent;
          border-radius: 16px;
          background: linear-gradient(45deg, #2EE2C5, #FF6B6B, #A78BFA, #2EE2C5) border-box;
          animation: border-glow 4s infinite linear;
          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: destination-out;
        }

        .card-glass:hover {
          transform: translateY(-6px) rotateX(10deg) rotateY(10deg);
          box-shadow: var(--neon-glow);
        }

        @keyframes border-glow {
          0% { background-position: 0% 50%; }
          100% { background-position: 400% 50%; }
        }

        .section-pattern {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 40 40'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
        }

        .text-gradient {
          background: linear-gradient(90deg, #2EE2C5, #FF6B6B, #A78BFA, #2EE2C5);
          background-size: 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-text 6s infinite;
          text-shadow: 0 2px 8px rgba(46, 226, 197, 0.3);
        }

        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        .section-divider {
          position: relative;
          height: 2px;
          background: linear-gradient(to right, transparent, #D1D5DB, transparent);
          margin: 3rem 0;
        }

        .section-divider::before {
          content: "•";
          position: absolute;
          left: 50%;
          top: -10px;
          transform: translateX(-50%);
          color: #2EE2C5;
          font-size: 1.5rem;
          animation: rainbow-dot 3s infinite;
        }

        @keyframes rainbow-dot {
          0% { color: #2EE2C5; }
          33% { color: #FF6B6B; }
          66% { color: #A78BFA; }
          100% { color: #2EE2C5; }
        }

        .btn-gradient {
          background: #5EEAD4;
          color: #1F2937;
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(46, 226, 197, 0.3);
        }

        .btn-gradient:hover {
          background: #2DD4BF;
          box-shadow: var(--neon-glow);
          transform: translateY(-3px);
        }

        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .chart-overlay::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(46, 226, 197, 0.05), transparent);
          pointer-events: none;
        }

        .fab {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background: linear-gradient(45deg, #2EE2C5, #FF6B6B);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .fab:hover {
          transform: scale(1.1);
          box-shadow: var(--neon-glow);
        }

        .read-more-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.3s ease;
        }

        .read-more-btn:hover {
          color: #FF6B6B;
        }

        .read-more-btn:focus {
          outline: none;
          ring: 2px solid #2EE2C5;
          ring-offset-2: 2px;
        }

        .chevron {
          transition: transform 0.4s ease;
        }

        .chevron--down {
          transform: rotate(0deg);
        }

        .chevron--up {
          transform: rotate(180deg);
        }

        .accordion-content {
          background: rgba(46, 226, 197, 0.05);
          padding: 1rem;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        /* CTA Section Styling */
        .cta-section {
          position: relative;
          background: linear-gradient(to right, #115E59, #BE123C);
          background-size: cover;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.05'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3Ccircle cx='15' cy='15' r='1'/%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }

        .cta-section::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(0, 0, 0, 0.3) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-section h2.text-gradient {
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .cta-section p {
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      <ReactTooltip id="home-tooltip" place="top" effect="solid" />

      {/* Hero Section */}
      <motion.section
        className="relative hero-gradient py-24 px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="hero-bg-illustration" />
        <div className="particle-bg">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`particle particle--${["teal", "coral", "violet"][i % 3]}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
              }}
            />
          ))}
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 text-gradient"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            suppressHydrationWarning
          >
            {token && userProfile?.user?.name
              ? `Welcome, ${userProfile.user.name}!`
              : "Welcome to Your Financial Future!"}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 text-dark"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-dark)' }}
          >
            Empower your finances with cutting-edge tools for budgeting, saving, and achieving your goals.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => router.push(token ? "/dashboard" : "/signup")}
              className="px-8 py-4 font-semibold rounded-lg btn-gradient shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {token ? "Go to Dashboard" : "Get Started"}
            </motion.button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-24"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              fill="#F5F7FA"
              fillOpacity="1"
              d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,85.3C672,96,768,96,864,90.7C960,85,1056,75,1152,64C1248,53,1344,43,1392,37.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </motion.section>

      <section className="py-20 px-6 section-pattern">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 mb-16 text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                step: "1",
                title: "Sign Up & Set Goals",
                description: "Create an account and define your financial goals to start your journey.",
                icon: (
                  <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L7 7"
                    />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Track Your Spending",
                description: "Monitor your expenses and income with intuitive tools and charts.",
                icon: (
                  <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Grow Your Wealth",
                description: "Use insights and analytics to make smarter financial decisions.",
                icon: (
                  <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke="round"
                      strokeWidth="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v16M4 4l4 4"
                    />
                  </svg>
                ),
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="card-glass p-8 text-center relative shimmer"
                variants={scaleIn}
                data-tooltip-id="home-tooltip"
                data-tooltip-content={step.description}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  {step.step}
                </div>
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="py-20 px-6 section-pattern">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 mb-16 text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Why Choose Us?
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Track Your Budget",
                description: "Easily monitor your spending and stay within your budget with intuitive tools.",
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L7 7"
                    />
                  </svg>
                ),
                title: "Set Financial Goals",
                description: "Create and track savings goals to achieve your financial dreams.",
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke="round"
                      strokeWidth="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v16M4 4l4 4"
                    />
                  </svg>
                ),
                title: "Analyze Cash Flow",
                description: "Get insights into your income and expenses with detailed analytics.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="card-glass p-8 text-center relative shimmer"
                variants={scaleIn}
                data-tooltip-id="home-tooltip"
                data-tooltip-content={feature.description}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="py-20 px-6 section-pattern">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 mb-16 text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            See Your Finances in Action
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="card-glass p-8 relative chart-overlay"
              variants={scaleIn}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sample Budget Allocation</h3>
              <div className="h-72">
                <Pie
                  data={budgetChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom", labels: { color: "#1F2937" } },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.label}: ${context.parsed}%`,
                        },
                      },
                    },
                    animation: {
                      duration: 1500,
                      easing: "easeOutQuart",
                    },
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              className="card-glass p-8 relative chart-overlay"
              variants={scaleIn}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Savings Growth Over Time</h3>
              <div className="h-72">
                <Bar
                  data={savingsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `₹${context.parsed.y.toLocaleString()}`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { callback: (value) => `₹${value.toLocaleString()}`, color: "#1F2937" },
                        grid: { color: "rgba(0, 0, 0, 0.05)" },
                      },
                      x: {
                        ticks: { color: "#1F2937" },
                        grid: { display: false },
                      },
                    },
                    animation: {
                      duration: 1500,
                      easing: "easeOutQuart",
                    },
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="py-20 px-6 section-pattern">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 mb-16 text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Finance Tips & Insights
          </motion.h2>
          <motion.div
            className="flex flex-col gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {financeTips.map((tip) => (
              <motion.div
                key={tip.id}
                className="card-glass p-8 relative shimmer"
                variants={scaleIn}
                data-tooltip-id="home-tooltip"
                data-tooltip-content="Click to read more"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 mb-4">{tip.excerpt}</p>
                <button
                  onClick={() => toggleTip(tip.id)}
                  className="read-more-btn text-teal-500 font-medium focus:outline-none"
                >
                  {expandedTip === tip.id ? "Show Less" : "Read More"}
                  <svg
                    className={`w-4 h-4 chevron ${expandedTip === tip.id ? "chevron--up" : "chevron--down"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedTip === tip.id && (
                    <motion.div
                      className="mt-4 space-y-2 accordion-content"
                      variants={accordionVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      {tip.fullContent.map((point, idx) => (
                        <p key={idx} className="text-gray-600">{point}</p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="py-20 px-6 bg-gradient-to-r from-teal-50 to-purple-50">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center text-gray-900 mb-16 text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="card-glass p-8 text-center relative shimmer"
                variants={scaleIn}
              >
                <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                <p className="text-gray-900 font-semibold">{testimonial.author}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* CTA Section with Updated Styling */}
      <section className="py-20 px-6 cta-section text-white">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Ready to Master Your Finances?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of users who are achieving their financial dreams with us.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => router.push(token ? "/dashboard" : "/signup")}
              className="px-8 py-4 font-semibold rounded-lg btn-gradient shadow-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {token ? "Go to Dashboard" : "Sign Up Now"}
            </motion.button>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="fab"
        onClick={() => router.push(token ? "/dashboard" : "/signup")}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        data-tooltip-id="home-tooltip"
        data-tooltip-content={token ? "Go to Dashboard" : "Sign Up"}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </motion.div>

      

    </main>
  );
}