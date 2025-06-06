"use client";
export default function FAQSection() {
    const faqs = [
        {
            q: "Is my financial data secure?",
            a: "Absolutely. We use advanced encryption and security protocols to ensure your data stays safe and private.",
        },
        {
            q: "Can I cancel my subscription anytime?",
            a: "Yes, you can cancel or downgrade your subscription at any time from your account settings.",
        },
        {
            q: "Do you offer personalized financial advice?",
            a: "Our Elite plan includes access to certified financial advisors for 1-on-1 guidance.",
        },
    ];

    return (
        <section className="py-20 px-6 bg-gray-100 text-gray-800">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8 text-gradient">Frequently Asked Questions</h2>
                <div className="text-left space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i}>
                            <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                            <p className="text-gray-700">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
