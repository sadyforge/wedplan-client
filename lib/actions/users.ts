
const baseUrl =  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Get all users
export const GetAllUsers = async (cookie?: string) => {
  const res = await fetch(`${baseUrl}/users`, {
    cache: "no-store",
    credentials: "include",
    headers: cookie ? { cookie } : undefined,
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  return res.json();
};

// Get single user
export const GetSingleUser = async (id: string) => {
  const res = await fetch(`${baseUrl}/users/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
};

// Block user
export const BlockUser = async (id: string) => {
  const res = await fetch(`${baseUrl}/users/${id}/block`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to block user");

  return res.json();
};

// Unblock user
export const UnblockUser = async (id: string) => {
  const res = await fetch(`${baseUrl}/users/${id}/unblock`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to unblock user");

  return res.json();
};


export const getUserPremiumById=async(userId:string)=>{
  const res=await fetch(`${baseUrl}/users/${userId}/premium`)
  return res.json()
}
