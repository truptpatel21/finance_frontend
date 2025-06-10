"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminSubscriptionManage() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        subscription_plan: "",
        role: "",
        address: "",
        subscription_expiry: "",
        pending_plan: "",
        pending_plan_effective: "",
    });

    const fetchSubscriptions = async () => {
        setLoading(true);
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to view subscriptions.");
            setLoading(false);
            return;
        }
        try {
            const response = await secureApiCall({
                endpoint: "/api/admin/users",
                data: {},
                token,
                requiresAuth: true,
            });
            if (response.code === "1") {
                setSubscriptions(response.data || []);
            } else {
                toast.error(response.messages || "Failed to load subscriptions.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching subscriptions.");
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (user) => {
        setEditingUser(user.id);
        setEditForm({
            subscription_plan: user.subscription_plan || "free",
            role: user.role || "user",
            address: user.address || "",
            subscription_expiry: user.subscription_expiry
                ? new Date(user.subscription_expiry).toISOString().slice(0, 16)
                : "",
            pending_plan: user.pending_plan || "",
            pending_plan_effective: user.pending_plan_effective
                ? new Date(user.pending_plan_effective).toISOString().slice(0, 16)
                : "",
        });
    };

    const cancelEditing = () => {
        setEditingUser(null);
        setEditForm({
            subscription_plan: "",
            role: "",
            address: "",
            subscription_expiry: "",
            pending_plan: "",
            pending_plan_effective: "",
        });
    };

    const updateUser = async (userId) => {
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to update user.");
            return;
        }
        try {
            const data = {
                user_id: userId,
                subscription_plan: editForm.subscription_plan,
                role: editForm.role,
                address: editForm.address || null,
                subscription_expiry: editForm.subscription_expiry || null,
                pending_plan: editForm.pending_plan || null,
                pending_plan_effective: editForm.pending_plan_effective || null,
            };
            const response = await secureApiCall({
                endpoint: "/api/admin/users/update",
                data,
                token,
                requiresAuth: true,
            });
            if (response.code === "1") {
                toast.success("User updated successfully.");
                fetchSubscriptions();
                cancelEditing();
            } else {
                toast.error(response.messages || "Failed to update user.");
            }
        } catch (error) {
            toast.error("An error occurred while updating user.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    return (
        <main className="p-6 text-gray-900 bg-gray-100 min-h-screen">
            <style jsx global>{`
                :root {
                    --background: #F3F4F6;
                    --foreground: #1F2937;
                    --accent: #3B82F6;
                    --secondary: #6B7280;
                    --border: #D1D5DB;
                    --glass-bg: rgba(255, 255, 255, 0.9);
                    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }

                .card-glass {
                    background: var(--glass-bg);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 16px;
                    box-shadow: var(--glass-shadow);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .card-glass:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                }

                .custom-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .custom-table th {
                    background-color: #F9FAFB;
                    font-weight: 600;
                    color: var(--foreground);
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 2px solid var(--border);
                }

                .custom-table td {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border);
                }

                .custom-table tbody tr {
                    transition: background-color 0.2s ease;
                }

                .custom-table tbody tr:hover {
                    background-color: #F9FAFB;
                }

                .btn {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    text-align: center;
                    min-width: 100px;
                }

                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .btn:active {
                    transform: translateY(0);
                    box-shadow: none;
                }

                .btn-primary {
                    background-color: #3B82F6;
                    color: white;
                }

                .btn-primary:hover {
                    background-color: #2563EB;
                }

                .btn-secondary {
                    background-color: #6B7280;
                    color: white;
                }

                .btn-secondary:hover {
                    background-color: #4B5563;
                }

                .btn-success {
                    background-color: #10B981;
                    color: white;
                }

                .btn-success:hover {
                    background-color: #059669;
                }

                .btn-disabled {
                    background-color: #D1D5DB;
                    color: #6B7280;
                    cursor: not-allowed;
                }

                .btn-disabled:hover {
                    transform: none;
                    box-shadow: none;
                }

                .input-field {
                    padding: 0.5rem;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    width: 100%;
                    background-color: white;
                }

                .select-field {
                    padding: 0.5rem;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    background-color: white;
                    width: 100%;
                }
            `}</style>

            <ToastContainer theme="light" />
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Subscription Management</h1>
            {loading ? (
                <p className="text-gray-500">Loading subscriptions...</p>
            ) : (
                <div className="card-glass p-6">
                    {subscriptions.length === 0 ? (
                        <p className="text-gray-500">No subscriptions found.</p>
                    ) : (
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Plan</th>
                                    <th>Role</th>
                                    <th>Address</th>
                                    <th>Subscription Expiry</th>
                                    <th>Pending Plan</th>
                                    <th>Stripe IDs</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        {editingUser === user.id ? (
                                            <>
                                                <td>
                                                    <select
                                                        name="subscription_plan"
                                                        value={editForm.subscription_plan}
                                                        onChange={handleInputChange}
                                                        className="select-field"
                                                    >
                                                        <option value="free">Free</option>
                                                        <option value="pro">Pro</option>
                                                        <option value="elite">Elite</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        name="role"
                                                        value={editForm.role}
                                                        onChange={handleInputChange}
                                                        className="select-field"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={editForm.address}
                                                        onChange={handleInputChange}
                                                        className="input-field"
                                                        placeholder="Enter address"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="datetime-local"
                                                        name="subscription_expiry"
                                                        value={editForm.subscription_expiry}
                                                        onChange={handleInputChange}
                                                        className="input-field"
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        name="pending_plan"
                                                        value={editForm.pending_plan}
                                                        onChange={handleInputChange}
                                                        className="select-field"
                                                    >
                                                        <option value="">None</option>
                                                        <option value="free">Free</option>
                                                        <option value="pro">Pro</option>
                                                        <option value="elite">Elite</option>
                                                    </select>
                                                    <input
                                                        type="datetime-local"
                                                        name="pending_plan_effective"
                                                        value={editForm.pending_plan_effective}
                                                        onChange={handleInputChange}
                                                        className="input-field mt-2"
                                                    />
                                                </td>
                                                <td>
                                                    <p className="text-sm text-gray-500">
                                                        Customer: {user.stripe_customer_id || "N/A"}
                                                        <br />
                                                        Subscription: {user.stripe_subscription_id || "N/A"}
                                                    </p>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => updateUser(user.id)}
                                                        className="btn btn-success mr-2"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="btn btn-secondary"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>
                                                    <span
                                                        className={
                                                            user.subscription_plan === "elite"
                                                                ? "text-green-600"
                                                                : user.subscription_plan === "pro"
                                                                    ? "text-blue-600"
                                                                    : "text-gray-600"
                                                        }
                                                    >
                                                        {user.subscription_plan
                                                            ? user.subscription_plan.charAt(0).toUpperCase() +
                                                            user.subscription_plan.slice(1)
                                                            : "Free"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={
                                                            user.role === "admin" ? "text-purple-600" : "text-gray-600"
                                                        }
                                                    >
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </span>
                                                </td>
                                                <td>{user.address || "N/A"}</td>
                                                <td>
                                                    {user.subscription_expiry
                                                        ? new Date(user.subscription_expiry).toLocaleString()
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    {user.pending_plan ? (
                                                        <span className="text-yellow-600">
                                                            {user.pending_plan.charAt(0).toUpperCase() +
                                                                user.pending_plan.slice(1)}{" "}
                                                            (Effective: {new Date(
                                                                user.pending_plan_effective
                                                            ).toLocaleDateString()})
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">None</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <p className="text-sm text-gray-500">
                                                        Customer: {user.stripe_customer_id || "N/A"}
                                                        <br />
                                                        Subscription: {user.stripe_subscription_id || "N/A"}
                                                    </p>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => startEditing(user)}
                                                        className="btn btn-primary"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </main>
    );
}