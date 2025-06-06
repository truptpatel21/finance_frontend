"use client";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">Financyy Privacy Policy</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Effective Date: June 6, 2025
                    </p>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-2">
                        At Financyy, your privacy is our priority. This Privacy Policy explains how our website collects, uses, and protects your personal information to help you manage your finances securely.
                    </p>
                </div>

                {/* Policy Content */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Privacy Commitment</h2>
                    <p className="text-gray-600 mb-6">
                        Financyy’s website, launched in 2025, is designed to empower you with tools for budgeting and analytics. We are committed to safeguarding your data and ensuring transparency in how we handle your information.
                    </p>

                    <div className="space-y-8">
                        {/* Section 1: Information We Collect */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">1. Information We Collect</h3>
                            <p className="text-gray-600">
                                We collect information you provide directly through our website, such as:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 mt-2">
                                <li>Personal details (e.g., name, email address) when you create an account or submit forms.</li>
                                <li>Financial data (e.g., budget entries) to provide personalized insights.</li>
                                <li>Usage data (e.g., pages visited) to improve our website’s functionality.</li>
                            </ul>
                        </div>

                        {/* Section 2: How We Use Your Information */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">2. How We Use Your Information</h3>
                            <p className="text-gray-600">
                                Your information is used to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 mt-2">
                                <li>Provide and personalize budgeting and analytics tools.</li>
                                <li>Send you updates, newsletters, or alerts about your account (with your consent).</li>
                                <li>Analyze website usage to enhance performance and user experience.</li>
                            </ul>
                        </div>

                        {/* Section 3: Data Protection */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">3. Data Protection</h3>
                            <p className="text-gray-600">
                                We implement industry-standard security measures, including:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 mt-2">
                                <li>Encryption of sensitive data during transmission and storage.</li>
                                <li>Regular security audits to identify and address vulnerabilities.</li>
                                <li>Access controls to limit data access to authorized personnel only.</li>
                            </ul>
                        </div>

                        {/* Section 4: Sharing Your Information */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">4. Sharing Your Information</h3>
                            <p className="text-gray-600">
                                We do not sell your personal information. We may share data only:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 mt-2">
                                <li>With trusted service providers (e.g., hosting services) under strict confidentiality agreements.</li>
                                <li>To comply with legal obligations or protect our rights.</li>
                            </ul>
                        </div>

                        {/* Section 5: Your Rights */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">5. Your Rights</h3>
                            <p className="text-gray-600">
                                You have the right to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 mt-2">
                                <li>Access, correct, or delete your personal information.</li>
                                <li>Opt out of marketing communications at any time.</li>
                                <li>Request data portability or restrict processing, where applicable.</li>
                            </ul>
                            <p className="text-gray-600 mt-2">
                                To exercise these rights, please submit a request via our website’s support form.
                            </p>
                        </div>

                        {/* Section 6: Cookies and Tracking */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">6. Cookies and Tracking</h3>
                            <p className="text-gray-600">
                                Our website uses cookies to enhance your experience, such as remembering your preferences. You can manage cookie settings through your browser.
                            </p>
                        </div>

                        {/* Section 7: Changes to This Policy */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">7. Changes to This Policy</h3>
                            <p className="text-gray-600">
                                We may update this Privacy Policy to reflect changes in our practices or legal requirements. Updates will be posted on our website with a revised effective date.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}