"use client";

export default function AboutPage() {
    const timeline = [
        {
            year: "2025",
            event: "Financyy launched its website, empowering millions to achieve financial freedom through smart budgeting and analytics.",
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">About Financyy</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Financyy is a website dedicated to helping you achieve financial freedom with smart budgeting, insightful analytics, and easy-to-use tools. Our platform empowers everyone to take control of their finances and reach their goals.
                    </p>
                </div>

                {/* Mission & Vision Section */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-10 mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Mission & Vision</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">Our Mission</h3>
                            <p className="text-gray-600">
                                To simplify financial planning through an intuitive website that offers personalized budgeting tools and actionable insights.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">Our Vision</h3>
                            <p className="text-gray-600">
                                To make financial literacy accessible to all through our website, helping users worldwide achieve their financial dreams.
                            </p>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Journey</h2>
                    <div className="space-y-6">
                        {timeline.map((item, index) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-24 text-blue-700 font-semibold">{item.year}</div>
                                <div className="ml-4">
                                    <p className="text-gray-600">{item.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}