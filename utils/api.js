import axios from "axios";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "./encdec";
import { toast } from "react-toastify";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export const secureApiCall = async ({
    endpoint,
    data = "",
    method = "post",
    token = null,
    contentType = "text/plain",
    requiresAuth = false, 
}) => {
    try {
        if (requiresAuth && !token) {
            token = Cookies.get("token");
            if (!token) {
                toast.warning("Please login to perform this action.");
                throw new Error("No token found");
            }
        }
        const encryptedData = data && typeof data === "object" ? encrypt(data) : data;

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
        });

        const decryptedData =
            typeof response.data === "string"
                ? JSON.parse(decrypt(response.data))
                : response.data;

        // if (decryptedData.code !== "1") {
        //     toast.error(decryptedData.message || "Operation failed.");
        // }

        return decryptedData;
    } catch (error) {
        console.error(`API call error (${endpoint}):`, error);
        // toast.error(error.message || "Something went wrong.");
        throw error;
    }
};