"use client";
export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-white">Finacyy</h3>
                    <p className="text-sm">Your all-in-one platform for smarter budgeting, tracking expenses, and achieving financial freedom.</p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-2">Company</h4>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/finacyy/about" className="hover:underline">About Us</a></li>
                        <li><a href="/finacyy/blogs" className="hover:underline">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-2">Support</h4>
                    <ul className="space-y-1 text-sm">
                        <li><a href="/finacyy/help-center" className="hover:underline">Help Center</a></li>
                        <li><a href="/finacyy/terms" className="hover:underline">Terms of Service</a></li>
                        <li><a href="/finacyy/privacy" className="hover:underline">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-2">Get in Touch</h4>
                    <p className="text-sm mb-2">We’d love to hear from you.</p>
                    <a
                        href="/contact"
                        className="inline-block btn-gradient px-4 py-2 rounded text-sm font-medium text-white"
                    >
                        Contact Us
                    </a>
                </div>

            </div>
            <div className="mt-12 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Finacyy. All rights reserved.
            </div>
        </footer>
    );
}
