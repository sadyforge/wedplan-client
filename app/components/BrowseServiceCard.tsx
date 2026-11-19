
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";

interface Service {
  _id: string;
  serviceName: string;
  category?: string;
  description?: string;
  price?: string | number;
  image?: string;
  location?: string;
}

interface BrowseServiceCardProps {
  service: Service;
}

const BrowseServiceCard = ({ service }: BrowseServiceCardProps) => {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-[#f2eadf]">
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
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#94774f] shadow-sm">
            {service.category}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-[#292820] transition group-hover:text-[#94774f]">
          {service.serviceName}
        </h3>

        <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
          {service.description
            ? service.description.length > 100
              ? `${service.description.slice(0, 100)}...`
              : service.description
            : "Explore this wedding service for your special day."}
        </p>

        {service.location && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} className="text-[#94774f]" />
            <span>{service.location}</span>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400">Starting Price</p>
            <p className="mt-1 text-lg font-bold text-[#94774f]">
              {service.price ? `৳${service.price}` : "Contact for price"}
            </p>
          </div>

          <Link
            href={`/browse-services/${service._id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#292820] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#94774f]"
          >
            View Details
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrowseServiceCard;
