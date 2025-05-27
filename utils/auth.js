import Cookies from "js-cookie";
import { decrypt } from "./encdec";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const checkAdminAccess = async (router) => {
    const token = Cookies.get("token");

    if (!token) {
        toast.warning("Access denied. Please login as admin.");
        router.push("/login");
        return false;
    }

    try {
        const decryptedWrapper = decrypt(token);
        const parsedWrapper = JSON.parse(decryptedWrapper);

        const jwt = parsedWrapper.jwt;
        if (!jwt) throw new Error("JWT not found in decrypted token");

        const payloadBase64 = jwt.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);

        const userRole = payload?.role;
        if (userRole !== "admin") {
            // console.error("Admin check failed: User is not an admin");
            // toast.error("Unauthorized access.");
            router.push("/");
            return false;
        }
        return true;
    } catch (error) {
        // console.error("Error decoding token:", error.message);
        // toast.error("Invalid token. Please login again.");
        router.push("/login");
        return false;
    }
};