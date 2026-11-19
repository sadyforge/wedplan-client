
import { GetServices } from "@/lib/actions/services";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Tag } from "lucide-react";

interface Service {
  _id: string;
  serviceName: string;
  category?: string;
  description?: string;
  price?: string | number;
  image?: string;
  location?: string;
  status?: string;
}

const HomeServices = async () => {
  const result = await GetServices();

  const services: Service[] = Array.isArray(result)
    ? result.filter((service: Service) => service.status === "approved").slice(0, 6)
    : [];

  return (
    <section className="bg-[#F8F4EF] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#94774f]">
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#292820] sm:text-4xl">
              Explore Wedding Services
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600">
              Find trusted professionals and everything you need to make your
              special day unforgettable.
            </p>
          </div>

          <Link
            href="/browse-services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#94774f] transition hover:text-[#292820]"
          >
            View All Services
            <ArrowRight size={18} />
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-[#e8e1d7]">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.serviceName}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No Image Available
                    </div>
                  )}

                  {service.category && (
                    <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#94774f] shadow-sm">
                      {service.category}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="line-clamp-1 text-xl font-bold text-[#292820]">
                    {service.serviceName}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                    {service.description || "Professional wedding service for your special day."}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
                    <div className="space-y-2">
                      {service.location && (
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin size={15} className="text-[#94774f]" />
                          {service.location}
                        </p>
                      )}

                      <p className="flex items-center gap-2 text-sm font-bold text-[#94774f]">
                        <Tag size={15} />
                        {service.price ? `৳${service.price}` : "Contact for price"}
                      </p>
                    </div>

                    <Link
                      href={`/browse-services/${service._id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#292820] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#94774f]"
                    >
                      View Details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d8cbb9] py-16 text-center">
            <h3 className="text-lg font-semibold text-[#292820]">
              No Services Available Yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Approved wedding services will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeServices;
