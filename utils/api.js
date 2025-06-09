import axios from "axios";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "./encdec";
import { toast } from "react-toastify";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export const secureApiCall = async (options) => {
    try {
        const {
            endpoint,
            data = "",
            method = "post",
            token: inputToken = null,
            contentType = "text/plain",
            requiresAuth = false,
        } = options;

        // Manually handle optional keys
        const token = inputToken || Cookies.get("token");
        const responseType = options.responseType || "json";
        const isEncrypted = options.hasOwnProperty("isEncrypted") ? options.isEncrypted : true;

        if (requiresAuth && !token) {
            toast.warning("Please login to perform this action.");
            throw new Error("No token found");
        }

        const encryptedData = isEncrypted && typeof data === "object" ? encrypt(data) : data;

        const headers = {
            "Content-Type": contentType,
            "Accept-Language": "en",
            "api-key": encrypt(process.env.NEXT_API_KEY || "nodenextapikey123"),
            ...(token && { token }),
        };

        const response = await axios({
            method,
            url: `${API_BASE}${endpoint}`,
            data: encryptedData,
            headers,
            responseType,
        });

        // ✅ Don't decrypt blob or when explicitly marked as unencrypted
        if (!isEncrypted || responseType === "blob") {
            return response.data;
        }

        const decryptedData =
            typeof response.data === "string"
                ? JSON.parse(decrypt(response.data))
                : response.data;

        return decryptedData;
    } catch (error) {
        console.error(`API call error (${options.endpoint}):`, error);
        throw error;
    }
};
  