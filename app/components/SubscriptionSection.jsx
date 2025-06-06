"use client";
export default function SubscriptionSection() {
    const plans = [
        {
            title: "Free",
            price: "₹0/month",
            features: [
                "Basic budget tracking",
                "Limited goal setting",
                "Standard support",
            ],
        },
        {
            title: "Pro",
            price: "₹299/month",
            features: [
                "Advanced analytics",
                "Unlimited goal tracking",
                "Priority support",
            ],
        },
        {
            title: "Elite",
            price: "₹599/month",
            features: [
                "Wealth management advisor",
                "Custom financial reports",
                "Early access to features",
            ],
        },
    ];

    return (
        <section className="py-20 px-6 bg-white text-gray-800">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6 text-gradient">Upgrade to Premium</h2>
                <p className="mb-10 text-lg">
                    Unlock advanced features to maximize your financial control and gain early access to new tools.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, i) => (
                        <div key={i} className="card-glass p-6 rounded-xl text-left">
                            <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
                            <p className="text-xl mb-4 text-teal-600 font-bold">{plan.price}</p>
                            <ul className="space-y-2 mb-6">
                                {plan.features.map((f, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" strokeWidth="2"
                                            viewBox="0 0 24 24">
                                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="btn-gradient px-4 py-2 rounded w-full font-medium">
                                {plan.title === "Free" ? "Current Plan" : "Subscribe"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
