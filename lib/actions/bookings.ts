
const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Create customer booking
export const CreateBooking = async (data: {
  serviceId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
}) => {
  try {
    const res = await fetch(`${baseUrl}/bookings`, {
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
        success: false,
        status: res.status,
        message: result.message || "Failed to submit booking.",
      };
    }

    return {
      ...result,
      status: res.status,
    };
  } catch (error) {
    console.error("CreateBooking error:", error);

    return {
      success: false,
      status: 500,
      message:
        error instanceof Error ? error.message : "Something went wrong.",
    };
  }
};

// Get customer bookings
export const GetMyBookings = async () => {
  try {
    const res = await fetch(`${baseUrl}/my-bookings`, {
      cache: "no-store",
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch bookings.");
    }

    return result;
  } catch (error) {
    console.error("GetMyBookings error:", error);

    return {
      success: false,
      data: [],
      message:
        error instanceof Error ? error.message : "Failed to fetch bookings.",
    };
  }
};

// Cancel customer booking
export const CancelBooking = async (id: string) => {
  try {
    const res = await fetch(`${baseUrl}/bookings/${id}/cancel`, {
      method: "PATCH",
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to cancel booking.");
    }

    return result;
  } catch (error) {
    console.error("CancelBooking error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to cancel booking.",
    };
  }
};


// Get vendor bookings
export const GetVendorBookings = async () => {
  try {
    const res = await fetch(`${baseUrl}/vendor-bookings`, {
      cache: "no-store",
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch vendor bookings.");
    }

    return result;
  } catch (error) {
    console.error("GetVendorBookings error:", error);

    return {
      success: false,
      data: [],
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch vendor bookings.",
    };
  }
};

// Update booking status
export const UpdateBookingStatus = async (
  id: string,
  status: "Accepted" | "Rejected"
) => {
  try {
    const res = await fetch(`${baseUrl}/bookings/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update booking status.");
    }

    return result;
  } catch (error) {
    console.error("UpdateBookingStatus error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    };
  }
};