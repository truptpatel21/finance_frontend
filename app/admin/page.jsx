"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { secureApiCall } from "@/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminUserManage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to view users.");
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
                setUsers(response.data || []);
            } else {
                toast.error(response.messages || "Failed to load users.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching users.");
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to update users.");
            return;
        }
        try {
            const response = await secureApiCall({
                endpoint: "/api/admin/users/update",
                data: {
                    user_id: userId,
                    is_active: currentStatus === "active" ? false : true,
                },
                token,
                requiresAuth: true,
            });
            if (response.code === "1") {
                toast.success("User status updated.");
                fetchUsers();
            } else {
                toast.error(response.messages || "Failed to update user.");
            }
        } catch (error) {
            toast.error("An error occurred while updating user.");
        }
    };

    const toggleUserDelete = async (userId, toDelete) => {
        const token = Cookies.get("token");
        if (!token) {
            toast.warning("Please login to update users.");
            return;
        }
        try {
            const response = await secureApiCall({
                endpoint: "/api/admin/users/update",
                data: {
                    user_id: userId,
                    is_deleted: toDelete,
                },
                token,
                requiresAuth: true,
            });
            if (response.code === "1") {
                toast.success(toDelete ? "User deleted." : "User retrieved.");
                fetchUsers();
            } else {
                toast.error(response.messages || "Failed to update user.");
            }
        } catch (error) {
            toast.error("An error occurred while updating user.");
        }
    };

    useEffect(() => {
        fetchUsers();
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

                /* Card Styling with Glassmorphism */
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

                /* Table Styling */
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

                /* Button Styling with Hover Effects */
                .btn {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    width: 120px;
                    text-align: center;
                }

                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .btn:active {
                    transform: translateY(0);
                    box-shadow: none;
                }

                /* Specific Button Colors */
                .btn-activate {
                    background-color: #10B981; /* Green for Activate */
                    color: white;
                }

                .btn-activate:hover {
                    background-color: #059669;
                }

                .btn-deactivate {
                    background-color: #F97316; /* Orange for Deactivate */
                    color: white;
                }

                .btn-deactivate:hover {
                    background-color: #EA580C;
                }

                .btn-delete {
                    background-color: #EF4444; /* Red for Delete */
                    color: white;
                }

                .btn-delete:hover {
                    background-color: #DC2626;
                }

                .btn-retrieve {
                    background-color: #3B82F6; /* Blue for Retrieve */
                    color: white;
                }

                .btn-retrieve:hover {
                    background-color: #2563EB;
                }

                .btn-disabled {
                    background-color: #D1D5DB; /* Gray for Disabled */
                    color: #6B7280;
                    cursor: not-allowed;
                }

                .btn-disabled:hover {
                    transform: none;
                    box-shadow: none;
                }
            `}</style>

            <ToastContainer theme="light" />
            <h1 className="text-3xl font-bold text-blue-600 mb-6">User Management</h1>
            {loading ? (
                <p className="text-gray-500">Loading users...</p>
            ) : (
                <div className="card-glass p-6">
                    {users.length === 0 ? (
                        <p className="text-gray-500">No users found.</p>
                    ) : (
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Activate/Deactivate</th>
                                    <th>Delete/Retrieve</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span
                                                className={
                                                    user.is_active ? "text-green-600" : "text-red-500"
                                                }
                                            >
                                                {user.is_active ? "Active" : "Inactive"}
                                            </span>
                                            {user.is_deleted ? (
                                                <span className="ml-2 text-xs text-red-400 font-semibold">
                                                    (Deleted)
                                                </span>
                                            ) : null}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    toggleUserStatus(
                                                        user.id,
                                                        user.is_active ? "active" : "inactive"
                                                    )
                                                }
                                                className={`btn ${user.is_deleted
                                                        ? "btn-disabled"
                                                        : user.is_active
                                                            ? "btn-deactivate"
                                                            : "btn-activate"
                                                    }`}
                                                disabled={user.is_deleted}
                                            >
                                                {user.is_active ? "Deactivate" : "Activate"}
                                            </button>
                                        </td>
                                        <td>
                                            {!user.is_deleted ? (
                                                <button
                                                    onClick={() => toggleUserDelete(user.id, true)}
                                                    className="btn btn-delete"
                                                >
                                                    Delete
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toggleUserDelete(user.id, false)}
                                                    className="btn btn-retrieve"
                                                >
                                                    Retrieve
                                                </button>
                                            )}
                                        </td>
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