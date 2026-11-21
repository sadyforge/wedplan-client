
"use server";

import { authFetch } from "@/lib/core/server";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Get all users
export const GetAllUsers = async (_cookie?: string) => {
  const res = await authFetch(`${baseUrl}/users`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  return res.json();
};

// Get single user
export const GetSingleUser = async (id: string) => {
  const res = await authFetch(`${baseUrl}/users/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
};

// Block user
export const BlockUser = async (id: string) => {
  const res = await authFetch(`${baseUrl}/users/${id}/block`, {
    method: "PATCH",
  });

  if (!res.ok) throw new Error("Failed to block user");

  return res.json();
};

// Unblock user
export const UnblockUser = async (id: string) => {
  const res = await authFetch(`${baseUrl}/users/${id}/unblock`, {
    method: "PATCH",
  });

  if (!res.ok) throw new Error("Failed to unblock user");

  return res.json();
};


export const getUserPremiumById=async(userId:string)=>{
  const res=await authFetch(`${baseUrl}/users/${userId}/premium`)
  return res.json()
}
