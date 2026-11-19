
"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { GetServices } from "@/lib/actions/services";
import BrowseServiceCard from "@/app/components/BrowseServiceCard";

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

const BrowseServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await GetServices();

        const approvedServices = Array.isArray(data)
          ? data.filter((service: Service) => service.status === "approved")
          : [];

        setServices(approvedServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = [
    "all",
    ...new Set(services.map((service) => service.category).filter(Boolean)),
  ];

  const filteredServices = useMemo(() => {
    let result = services.filter((service) => {
      const matchesSearch =
        service.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
        service.category?.toLowerCase().includes(search.toLowerCase()) ||
        service.location?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || service.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") {
      result = [...result].sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (sort === "price-high") {
      result = [...result].sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    } else if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.serviceName.localeCompare(b.serviceName)
      );
    }

    return result;
  }, [services, search, category, sort]);

  return (
    <section className="min-h-screen bg-[#F8F4EF] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#94774f]">
            Find Your Perfect Wedding Services
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#292820] sm:text-5xl">
            Browse Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Explore trusted wedding professionals and find everything you
            need to make your special day unforgettable.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-[#e8e1d7] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services, category or location..."
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f7] py-3.5 pl-11 pr-4 text-sm text-[#292820] outline-none transition focus:border-[#94774f]"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-gray-200 bg-[#faf9f7] px-4 py-3.5 text-sm text-[#292820] outline-none focus:border-[#94774f]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All Categories" : item}
                  </option>
                ))}
              </select>

              <div className="relative">
                <SlidersHorizontal
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94774f]"
                />

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f7] py-3.5 pl-9 pr-4 text-sm text-[#292820] outline-none focus:border-[#94774f]"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#292820]">
              Available Services
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredServices.length} services found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-[#94774f]" size={35} />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-[#e8e1d7] bg-white py-20 text-center">
            <Search className="mx-auto text-[#94774f]" size={35} />
            <h3 className="mt-4 text-lg font-semibold text-[#292820]">
              No Services Found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <BrowseServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseServices;
