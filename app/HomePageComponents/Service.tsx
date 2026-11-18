
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Photography & Videography",
    category: "Capture Every Moment",
    price: "Starting from ৳15,000",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Wedding Venues",
    category: "Find Your Perfect Place",
    price: "Starting from ৳30,000",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Decoration & Florist",
    category: "Beautiful Wedding Spaces",
    price: "Starting from ৳10,000",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Catering Services",
    category: "Delicious Wedding Moments",
    price: "Starting from ৳500 / person",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Makeup & Styling",
    category: "Look Beautiful, Feel Special",
    price: "Starting from ৳5,000",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Wedding Fashion",
    category: "Your Dream Wedding Look",
    price: "Starting from ৳8,000",
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=900&auto=format&fit=crop",
  },
];

const ServiceCards = () => {
  return (
    <section className="bg-[#F8F4EF] px-5 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[3px] text-[#C98291]">
            EXPLORE OUR SERVICES
          </p>

          <h2 className="font-serif text-3xl text-[#302925] sm:text-4xl">
            Everything for Your{" "}
            <span className="italic text-[#C98291]">Special Day</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#786C65]">
            Find trusted wedding professionals and discover everything
            you need to create your perfect celebration.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group overflow-hidden rounded-2xl border border-[#EEE3DC] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-[#B66F7F]">
                  0{index + 1}
                </span>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C98291]">
                  {service.category}
                </p>

                <h3 className="mt-2 text-xl font-semibold text-[#302925]">
                  {service.title}
                </h3>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#F0E8E2] pt-5">
                  <p className="text-sm font-semibold text-[#665B55]">
                    {service.price}
                  </p>

                  <Link
                    href="/services"
                    className="shrink-0 text-sm font-semibold text-[#C98291] transition hover:text-[#302925]"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-block rounded-full border border-[#C98291] px-8 py-3 text-sm font-semibold text-[#B66F7F] transition hover:bg-[#C98291] hover:text-white"
          >
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
