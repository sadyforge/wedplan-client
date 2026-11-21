
import { Service } from "./types";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ServiceData = Service | Partial<Service>;

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const readResponse = async (res: Response) => {
  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result.message || "Request failed.");
  }

  return result;
};

// add service
export const AddServices = async (data: ServiceData) => {
  try {
    const res = await fetch(`${baseUrl}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ...result,
        success: false,
        code: result.code,
        message: result.message || "Failed to add service.",
      };
    }

    return result;
  } catch (error) {
    console.error("AddServices error:", error);

    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Failed to add service.",
    };
  }
};
// get all services
export const GetServices = async (cookie?: string) => {
  try {
    const res = await fetch(`${baseUrl}/services`, {
      cache: "no-store",
      credentials: "include",
      headers: cookie ? { cookie } : undefined,
    });

    return await readResponse(res);
  } catch (error) {
    console.error("GetServices error:", error);
    return [];
  }
};

// get all approved services for public browse page
export const GetApprovedServices = async () => {
  try {
    const res = await fetch(`${baseUrl}/browse-service`, {
      cache: "no-store",
    });

    return await readResponse(res);
  } catch (error) {
    console.error("GetApprovedServices error:", error);
    return [];
  }
};

// get vendor services
export const GetVendorServices = async (email: string, cookie?: string) => {
  try {
    const res = await fetch(
      `${baseUrl}/vendor-services/${encodeURIComponent(email)}`,
      {
        cache: "no-store",
        credentials: "include",
        headers: cookie ? { cookie } : undefined,
      }
    );

    return await readResponse(res);
  } catch (error) {
    console.error("GetVendorServices error:", error);
    return [];
  }
};

export const GetMyServices = GetVendorServices;

// get single service
export const GetSingleService = async (id: string, cookie?: string) => {
  try {
    const res = await fetch(`${baseUrl}/services/${id}`, {
      cache: "no-store",
      credentials: "include",
      headers: cookie ? { cookie } : undefined,
    });

    return await readResponse(res);
  } catch (error) {
    console.error("GetSingleService error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch service."),
    };
  }
};

// get single approved service for public details page
export const GetApprovedService = async (id: string) => {
  try {
    const res = await fetch(`${baseUrl}/browse-service/${id}`, {
      cache: "no-store",
    });

    return await readResponse(res);
  } catch (error) {
    console.error("GetApprovedService error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch service."),
    };
  }
};

// update service
export const UpdateService = async (id: string, data: Partial<Service>) => {
  try {
    const res = await fetch(`${baseUrl}/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return await readResponse(res);
  } catch (error) {
    console.error("UpdateService error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to update service."),
    };
  }
};

export const UpdateServices = UpdateService;

// delete service
export const DeleteService = async (id: string) => {
  try {
    const res = await fetch(`${baseUrl}/services/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return await readResponse(res);
  } catch (error) {
    console.error("DeleteService error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete service."),
    };
  }
};

export const DeleteServices = DeleteService;

// approve service (admin only)
export const ApproveService = async (id: string) => {
  try {
    const res = await fetch(`${baseUrl}/services/${id}/approve`, {
      method: "PATCH",
      credentials: "include",
    });

    return await readResponse(res);
  } catch (error) {
    console.error("ApproveService error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to approve service."),
    };
  }
};

// reject service (admin only)
export const RejectService = async (id: string) => {
  try {
    const res = await fetch(`${baseUrl}/services/${id}/reject`, {
      method: "PATCH",
      credentials: "include",
    });

    return await readResponse(res);
  } catch (error) {
    console.error("RejectService error:", error);
    return {
      success: false,
      message: getErrorMessage(error, "Failed to reject service."),
    };
  }
};
