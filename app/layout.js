import { Geist } from "next/font/google";
import "./globals.css";

import DynamicNavbar from "./components/DynamicNavbar";
import Footer from "./components/Footer";

const geist = Geist({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-gray-100 min-h-screen`}
        suppressHydrationWarning
      >
        <DynamicNavbar />
        <main className="max-w-7xl mx-auto py-8 px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}