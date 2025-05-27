"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
import Cookies from "js-cookie";
import { decrypt } from "@/utils/encdec";

export default function DynamicNavbar() {
    const [role, setRole] = useState(null);
    const router = useRouter();

    const checkRole = () => {
        const token = Cookies.get("token");
        if (!token) {
            setRole("user");
            return;
        }

        try {
            const decryptedWrapper = decrypt(token);
            const parsedWrapper = JSON.parse(decryptedWrapper);

            const jwt = parsedWrapper.jwt;
            if (!jwt) throw new Error("JWT not found in decrypted token");

            const payloadBase64 = jwt.split(".")[1];
            const payloadJson = atob(payloadBase64);
            const payload = JSON.parse(payloadJson);

            const userRole = payload?.role === "admin" ? "admin" : "user";
            setRole(userRole);
        } catch (err) {
            console.error("Error decoding token in navbar:", err.message);
            setRole("user");
        }
    };

    useEffect(() => {
        checkRole(); 

        const interval = setInterval(() => {
            checkRole();
        }, 1000); 

        return () => clearInterval(interval); 
    }, [router]);

    if (role === null) return null;

    return role === "admin" ? <AdminNavbar /> : <Navbar />;
}