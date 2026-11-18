
import Link from "next/link";
import Image from "next/image";

const Banner = () => {
  return (
    <section className="bg-[#F8F4EF]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24 lg:px-8">
        <div className="space-y-7">
          <span className="inline-block rounded-full border border-[#E8D5D3] bg-[#F3E5E3] px-4 py-2 text-xs font-semibold tracking-[2px] text-[#B66F7F]">
            YOUR DREAM DAY STARTS HERE
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#302925] sm:text-5xl lg:text-6xl">
            Plan Your Perfect
            <span className="mt-2 block font-serif font-normal italic text-[#C98291]">
              Wedding Day
            </span>
          </h1>

          <p className="max-w-lg text-base leading-8 text-[#786C65]">
            Make your special day unforgettable. Discover trusted wedding
            vendors, explore beautiful venues, and bring your dream wedding
            to life with WedPlan.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="rounded-full bg-[#C98291] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B66F7F] hover:shadow-md"
            >
              Explore Services →
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full border border-[#DCCBC2] px-7 py-3.5 text-sm font-semibold text-[#514640] transition hover:border-[#C98291] hover:text-[#C98291]"
            >
              Get Started
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div>
              <h3 className="text-2xl font-bold text-[#302925]">500+</h3>
              <p className="text-xs text-[#897B73]">Wedding Vendors</p>
            </div>

            <div className="h-10 w-px bg-[#E5D9D1]" />

            <div>
              <h3 className="text-2xl font-bold text-[#302925]">1K+</h3>
              <p className="text-xs text-[#897B73]">Happy Couples</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-[#EBD5D2] blur-3xl" />

          <div className="relative overflow-hidden rounded-[32px] border-[8px] border-white shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
              alt="Beautiful wedding ceremony decoration"
              width={1200}
              height={1400}
              priority
              className="h-[400px] w-full object-cover sm:h-[500px]"
            />
          </div>

          <div className="absolute -bottom-6 -left-4 rounded-2xl border border-[#EFE3DC] bg-white px-5 py-4 shadow-lg sm:-left-8">
            <p className="font-serif text-lg italic text-[#C98291]">
              Your Story, Your Day
            </p>
            <p className="mt-1 text-xs text-[#897B73]">
              Let&apos;s make it unforgettable
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
