"use client";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">Finacyy Terms of Service</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Effective Date: June 6, 2025
                    </p>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-2">
                        By using the Finacyy website, you agree to these Terms of Service. Please read them carefully to understand your rights and responsibilities.
                    </p>
                </div>

                {/* Terms Content */}
                <div className="bg-white/95 rounded-2xl shadow-2xl p-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Terms</h2>
                    <p className="text-gray-600 mb-6">
                        These Terms of Service govern your use of the Finacyy website, launched in 2025 to provide budgeting and analytics tools. By accessing our website, you agree to comply with these terms.
                    </p>

                    <div className="space-y-8">
                        {/* Section 1: Acceptance of Terms */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">1. Acceptance of Terms</h3>
                            <p className="text-gray-600">
                                By accessing or using the Finacyy website, you confirm that you are at least 18 years old and agree to be bound by these Terms of Service. If you do not agree, please do not use our website.
                            </p>
                        </div>

                        {/* Section 2: User Responsibilities */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">2. User Responsibilities</h3>
                            <p className="text-gray-600">
                                You are responsible for:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 mt-2">
                                <li>Providing accurate and up-to-date information when creating an account or using our tools.</li>
                                <li>Maintaining the confidentiality of your account credentials.</li>
                                <li>Using the website in compliance with all applicable laws and regulations.</li>
                            </ul>
                        </div>

                        {/* Section 3: Service Usage */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">3. Service Usage</h3>
                            <p className="text-gray-600">
                                The Finacyy website provides tools for budgeting and financial analytics. You agree not to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 mt-2">
                                <li>Use the website for any unlawful or unauthorized purpose.</li>
                                <li>Attempt to access or interfere with our systems or other users’ data.</li>
                                <li>Reproduce, modify, or distribute our content without permission.</li>
                            </ul>
                        </div>

                        {/* Section 4: Intellectual Property */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">4. Intellectual Property</h3>
                            <p className="text-gray-600">
                                All content on the Finacyy website, including text, graphics, and software, is owned by Finacyy or its licensors and is protected by intellectual property laws. You may use our tools for personal, non-commercial purposes only.
                            </p>
                        </div>

                        {/* Section 5: Termination */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">5. Termination</h3>
                            <p className="text-gray-600">
                                We may suspend or terminate your access to the website if you violate these terms or engage in activities that harm our platform or other users. You may also close your account at any time by following the instructions on our website.
                            </p>
                        </div>

                        {/* Section 6: Limitation of Liability */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">6. Limitation of Liability</h3>
                            <p className="text-gray-600">
                                Finacyy provides its website on an “as-is” basis. We are not liable for:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 mt-2">
                                <li>Any errors or interruptions in service.</li>
                                <li>Losses arising from your use of our tools or reliance on our analytics.</li>
                                <li>Any indirect, incidental, or consequential damages.</li>
                            </ul>
                        </div>

                        {/* Section 7: Changes to Terms */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">7. Changes to Terms</h3>
                            <p className="text-gray-600">
                                We may update these Terms of Service to reflect changes in our practices or legal requirements. Updates will be posted on our website with a revised effective date, and continued use of the website constitutes acceptance of the new terms.
                            </p>
                        </div>

                        {/* Section 8: Governing Law */}
                        <div>
                            <h3 className="text-xl font-medium text-blue-700 mb-2">8. Governing Law</h3>
                            <p className="text-gray-600">
                                These terms are governed by the laws of [Your Jurisdiction, e.g., Delaware, USA], without regard to its conflict of law principles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}