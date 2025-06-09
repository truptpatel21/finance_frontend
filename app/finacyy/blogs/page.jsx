"use client";
import { useState } from "react";

export default function BlogPage() {
    const [category, setCategory] = useState("All");
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const blogPosts = [
        {
            title: "5 Tips for Smarter Budgeting in 2025",
            excerpt: "Learn how to optimize your budget with our expert tips, tailored for the new year.",
            category: "Budgeting",
            date: "June 1, 2025",
        },
        {
            title: "Understanding Financial Analytics",
            excerpt: "Discover how Finacyy’s analytics tools can help you make informed decisions.",
            category: "Analytics",
            date: "May 15, 2025",
        },
        {
            title: "Your Path to Financial Freedom",
            excerpt: "Inspiring stories from users who achieved their goals with Finacyy.",
            category: "Stories",
            date: "April 20, 2025",
        },
        {
            title: "New Features Launched in 2025",
            excerpt: "Explore the latest updates to the Finacyy website for better financial management.",
            category: "Updates",
            date: "March 10, 2025",
        },
    ];

    const categories = ["All", "Budgeting", "Analytics", "Stories", "Updates"];

    const filteredPosts = category === "All"
        ? blogPosts
        : blogPosts.filter(post => post.category === category);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate newsletter subscription (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEmail("");
        setSubmitting(false);
        alert("Thank you for subscribing to our newsletter!");
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">Finacyy Blog</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Stay informed with financial tips, product updates, and inspiring stories from the Finacyy website, launched in 2025 to empower your financial journey.
                    </p>
                </div>

                {/* Featured Post */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-10 mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Post</h2>
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-xl font-medium text-blue-700 mb-2">{blogPosts[0].title}</h3>
                        <p className="text-gray-600 mb-2">{blogPosts[0].excerpt}</p>
                        <p className="text-sm text-gray-500">{blogPosts[0].date} • {blogPosts[0].category}</p>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-8 flex justify-center space-x-4">
                    {categories.map((cat, index) => (
                        <button
                            key={index}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${category === cat
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Blog Posts */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-10 mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Posts</h2>
                    {filteredPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-8">
                            {filteredPosts.map((post, index) => (
                                <div key={index} className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-medium text-blue-700 mb-2">{post.title}</h3>
                                    <p className="text-gray-600 mb-2">{post.excerpt}</p>
                                    <p className="text-sm text-gray-500">{post.date} • {post.category}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">No posts found for this category.</p>
                    )}
                </div>

                {/* Newsletter Subscription */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-10 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subscribe to Our Newsletter</h2>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        Get the latest financial tips and updates from Finacyy delivered to your inbox.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-r-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            {submitting ? "Subscribing..." : "Subscribe"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}