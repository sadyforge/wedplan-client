
"use client";

import { useEffect, useState } from "react";
import ServiceCard from "@/app/components/service-card";
import { GetBrowseServices } from "@/lib/actions/browse";

const BrowseServiceCard = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await GetBrowseServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <p className="py-10 text-center">Loading services...</p>;
  }

  return (
    <section className="bg-[#F8F4EF] px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[3px] text-[#C98291]">
            EXPLORE OUR SERVICES
          </p>

          <h2 className="font-serif text-3xl text-[#302925] sm:text-4xl">
            Everything for Your{" "}
            <span className="italic text-[#C98291]">Special Day</span>
          </h2>
        </div>

        {services.length === 0 ? (
          <p className="py-10 text-center text-[#786C65]">
            No services available right now.
          </p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseServiceCard;
