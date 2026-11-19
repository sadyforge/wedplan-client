import { Service } from "./types";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const AddServices = async (data: Service) => {
  try {
    const res = await fetch(`${baseUrl}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to add service.");
    }

    return result;
  } catch (error) {
    console.error("AddServices error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong.",
    };
  }
};

// Get All Services
export const GetServices = async () => {
  try {
    const res = await fetch(`${baseUrl}/services`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch services.");
    }

    return await res.json();
  } catch (error) {
    console.error("GetServices error:", error);
    return [];
  }
};