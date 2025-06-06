"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const faqs = [
        {
            question: "How do I reset my password?",
            answer: "Go to the login page and click 'Forgot Password' to receive a reset link via email."
        },
        {
            question: "How can I track my expenses?",
            answer: "Use the dashboard to add transactions manually or connect your bank account for automatic tracking."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we use industry-standard encryption to protect your data."
        },
        {
            question: "How do I set up a budget?",
            answer: "Navigate to the Budgets section, click 'Create Budget,' and follow the prompts to set your limits."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleContactRedirect = () => {
        router.push("/contact");
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">Financyy Help Center</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get answers to your questions about managing your finances, setting budgets, or understanding analytics. We're here to help you succeed!
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-12">
                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for help topics..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
                            />
                        </svg>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-10 mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-6">
                            {filteredFaqs.map((faq, index) => (
                                <div key={index} className="border-b border-gray-200 pb-4">
                                    <h3 className="text-lg font-medium text-blue-700">{faq.question}</h3>
                                    <p className="text-gray-600 mt-2">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">No results found for your search.</p>
                    )}
                </div>

                {/* Contact Us Section */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Still Need Help?</h2>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        Our support team is ready to assist you with any questions or issues. Reach out to us directly!
                    </p>
                    <button
                        onClick={handleContactRedirect}
                        className="py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Contact Us
                    </button>
                </div>
            </div>
        </main>
    );
}