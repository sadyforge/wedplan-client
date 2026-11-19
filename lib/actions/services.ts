import { Service } from "./types";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  //post 
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

// get single services
export const GetSingleService = async (id: string) => {
  try {
    const res = await fetch(`${baseUrl}/services/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch service");
    }

    return await res.json();
  } catch (error) {
    console.error("GetSingleService error:", error);
    return {
      success: false,
      message: "Failed to fetch service",
    };
  }
};


// edit
export const UpdateServices = async (id: string, data: Partial<Service>) => {
  try {
    const res = await fetch(`${baseUrl}/services/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("UpdateServices error:", error);

    return {
      success: false,
      message: "Failed to update service.",
    };
  }
};


//delete
export const DeleteServices = async (id: string) => {
  try {
    const res = await fetch(`${baseUrl}/services/${id}`, {
      method: "DELETE",
    });

    return await res.json();
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete service.",
    };
  }
};