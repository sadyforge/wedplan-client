const baseUrl =  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const GetBrowseServices = async () => {
  const res = await fetch(`${baseUrl}/browse-service`);

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};

// Get single browse service
export const GetSingleBrowseService = async (id: string) => {
  const res = await fetch(`${baseUrl}/browse-service/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch service");
  }

  return res.json();
};