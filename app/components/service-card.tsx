
"use client";

import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Star,
  Heart,
  Camera,
  Music,
  Utensils,
  Flower2,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: string;
  location: string;
  image: string;
  vendorName: string;
  vendorEmail: string;
  rating: number;
  totalReviews: number;
  status: string;
  isFeatured: boolean;
}

const categoryIcons: Record<string, LucideIcon> = {
  Photography: Camera,
  Catering: Utensils,
  Decoration: Flower2,
  "Music & DJ": Music,
  "Wedding Planner": Sparkles,
};

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const Icon = categoryIcons[service.category] || Sparkles;

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#EAE0D7] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#302925]/5">
      {/* Service Image */}
      <div
        className="relative flex h-56 items-center justify-center bg-gradient-to-br from-[#DCC6B5] to-[#A98775] bg-cover bg-center"
        style={{
          backgroundImage: service.image
            ? `url("${service.image}")`
            : undefined,
        }}
      >
        {!service.image && (
          <Icon size={58} strokeWidth={1.1} className="text-white/80" />
        )}

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#765E55]">
          {service.category}
        </span>

        <button
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#8D6B6B] transition hover:bg-white hover:text-[#C98291]"
        >
          <Heart size={17} />
        </button>

        <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#50443D]">
          <Star size={13} className="fill-[#D5A65B] text-[#D5A65B]" />
          {service.rating}
          <span className="font-normal text-[#8D8178]">
            ({service.totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-7 text-[#302925] transition group-hover:text-[#B87584]">
            {service.title}
          </h3>
        </div>

        <p className="mb-4 text-sm text-[#8D8178]">
          Provided by{" "}
          <span className="font-medium text-[#5D5048]">
            {service.vendorName}
          </span>
        </p>

        <div className="mb-5 flex items-center gap-2 text-sm text-[#8D8178]">
          <MapPin size={16} className="shrink-0 text-[#C98291]" />
          {service.location}
        </div>

        <div className="flex items-center justify-between border-t border-[#F0E9E2] pt-4">
          <div>
            <p className="text-xs text-[#A18F83]">{service.priceType}</p>
            <p className="mt-1 text-xl font-bold text-[#302925]">
              ৳{service.price.toLocaleString("en-BD")}
            </p>
          </div>

          <Link
            href={`/browse-services/${service._id}`}
            className="flex items-center gap-2 rounded-xl bg-[#302925] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#C98291]"
          >
            View Details
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
