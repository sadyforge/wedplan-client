
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowRight,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { GetBrowseServices } from "@/lib/actions/browse";
import ServiceCard, { type Service } from "@/app/components/service-card";

const categories = [
  "All Categories",
  "Photography",
  "Catering",
  "Decoration",
  "Music & DJ",
  "Wedding Planner",
];

const BrowseServicePage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("default");

  // Applied filter states
  const [appliedCategory, setAppliedCategory] = useState("All Categories");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [appliedSort, setAppliedSort] = useState("default");

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

  // Search and filter
  const filteredServices = useMemo(() => {
    let result = [...services];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (service) =>
          service.title?.toLowerCase().includes(query) ||
          service.category?.toLowerCase().includes(query) ||
          service.vendorName?.toLowerCase().includes(query) ||
          service.location?.toLowerCase().includes(query)
      );
    }

    if (appliedCategory !== "All Categories") {
      result = result.filter(
        (service) => service.category === appliedCategory
      );
    }

    if (appliedLocation.trim()) {
      result = result.filter((service) =>
        service.location
          ?.toLowerCase()
          .includes(appliedLocation.trim().toLowerCase())
      );
    }

    if (appliedSort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (appliedSort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    services,
    searchQuery,
    appliedCategory,
    appliedLocation,
    appliedSort,
  ]);

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedCategory(category);
    setAppliedLocation(location);
    setAppliedSort(sort);
  };

  // Search services
  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  // Reset filters
  const handleResetFilters = () => {
    setCategory("All Categories");
    setLocation("");
    setSort("default");
    setAppliedCategory("All Categories");
    setAppliedLocation("");
    setAppliedSort("default");
    setSearchInput("");
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-[#F8F4EF]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#302925] px-5 py-20 text-center sm:py-24">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#C98291]/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#C98291]/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium tracking-widest text-[#E5B7BE]">
            <Sparkles size={14} />
            FIND YOUR PERFECT MATCH
          </span>

          <h1 className="text-4xl font-semibold leading-tight text-[#F8F4EF] sm:text-5xl lg:text-6xl">
            Discover Wedding
            <span className="block font-serif italic text-[#D99EAA]">
              Services
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#D6CBC2] sm:text-base">
            Find trusted professionals and everything you need to make your
            special day truly unforgettable.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-2xl bg-[#F8F4EF] p-2 shadow-xl"
          >
            <Search className="ml-3 shrink-0 text-[#947C70]" size={21} />

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search wedding services..."
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#302925] outline-none placeholder:text-[#A99B91]"
            />

            <button
              type="submit"
              className="rounded-xl bg-[#C98291] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B66F7F]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#C98291]">
              EXPLORE OUR COLLECTION
            </p>

            <h2 className="text-3xl font-semibold text-[#302925]">
              Browse Services
            </h2>

            <p className="mt-2 text-sm text-[#8D8178]">
              Discover the best services for your wedding celebration.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#84766D]">
            <SlidersHorizontal size={17} />
            <span>Find what you need</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-9 grid grid-cols-1 gap-3 rounded-2xl border border-[#EAE0D7] bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {/* Category */}
          <div className="relative">
            <label className="mb-2 block text-xs font-semibold text-[#6F6259]">
              CATEGORY
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#EAE0D7] bg-[#FBF9F6] px-4 py-3 text-sm text-[#50443D] outline-none focus:border-[#C98291]"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#6F6259]">
              LOCATION
            </label>

            <div className="flex items-center rounded-xl border border-[#EAE0D7] bg-[#FBF9F6] px-4">
              <MapPin size={17} className="text-[#C98291]" />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="w-full bg-transparent px-2 py-3 text-sm text-[#50443D] outline-none placeholder:text-[#A99B91]"
              />
            </div>
          </div>

          {/* Price Sorting */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-[#6F6259]">
              SORT BY PRICE
            </label>

            <div className="flex items-center rounded-xl border border-[#EAE0D7] bg-[#FBF9F6] px-4">
              <ArrowUpDown size={17} className="text-[#C98291]" />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-sm text-[#50443D] outline-none"
              >
                <option value="default">Default Sorting</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Apply Filters */}
          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full rounded-xl border border-[#C98291] bg-[#C98291] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#B66F7F]"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Result Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#84766D]">
            Showing{" "}
            <span className="font-semibold text-[#302925]">
              {filteredServices.length} services
            </span>
          </p>

          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-[#B87584] transition hover:text-[#302925]"
          >
            Reset Filters
          </button>
        </div>

        {/* Service Cards */}
        {loading ? (
          <div className="py-20 text-center text-[#84766D]">
            Loading wedding services...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-[#EAE0D7] bg-white py-20 text-center">
            <Sparkles size={40} className="mx-auto mb-4 text-[#C98291]" />

            <h3 className="text-xl font-semibold text-[#302925]">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-[#8D8178]">
              Try changing your search or filters.
            </p>

            <button
              onClick={handleResetFilters}
              className="mt-5 rounded-xl bg-[#302925] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#C98291]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
      </section>

      <section className="px-5 pb-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-[#EDE1D7] px-7 py-10 text-center sm:flex-row sm:px-12 sm:text-left">
          <div>
            <div className="mb-2 flex items-center justify-center gap-2 text-[#B87584] sm:justify-start">
              <CalendarDays size={18} />
              <span className="text-xs font-semibold tracking-widest">
                YOUR DREAM WEDDING STARTS HERE
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-[#302925] sm:text-3xl">
              Make Every Moment Special
            </h2>

            <p className="mt-2 text-sm text-[#84766D]">
              Find the right professionals for your big day.
            </p>
          </div>

          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[#302925] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#C98291]"
          >
            Explore WedPlan
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default BrowseServicePage;
