
import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#302925] text-[#F8F4EF]">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <Heart className="h-6 w-6 fill-[#C98291] text-[#C98291]" />
              <span className="text-2xl font-bold">
                Wed<span className="text-[#C98291]">Plan</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#C5B8AE]">
              Making your dream wedding a beautiful reality. Discover
              trusted vendors and plan your special day with confidence.
            </p>

            <div className="mt-6 flex gap-3">
              {[
                { Icon: FaFacebookF, label: "Facebook", href: "https://www.facebook.com/" },
                { Icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#655951] text-[#E8C7CB] transition hover:border-[#C98291] hover:bg-[#C98291] hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-base font-semibold">Quick Links</h3>
            <ul className="space-y-4 text-sm text-[#C5B8AE]">
              <li>
                <Link href="/" className="hover:text-[#E8B7C0]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse-services" className="hover:text-[#E8B7C0]">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-[#E8B7C0]">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-[#E8B7C0]">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-base font-semibold">Our Services</h3>
            <ul className="space-y-4 text-sm text-[#C5B8AE]">
              <li>Photography & Videography</li>
              <li>Wedding Venues</li>
              <li>Decoration & Florist</li>
              <li>Catering Services</li>
              <li>Makeup & Styling</li>
              <li>Wedding Fashion</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-base font-semibold">Contact Us</h3>
            <ul className="space-y-5 text-sm text-[#C5B8AE]">
              <li className="flex items-center gap-3">
                <Mail size={17} className="shrink-0 text-[#C98291]" />
                support@wedplan.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} className="shrink-0 text-[#C98291]" />
                +880 1712-345678
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={17} className="shrink-0 text-[#C98291]" />
                Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#51463F] pt-7 text-center sm:flex-row">
          <p className="text-xs text-[#B9AAA0]">
            © 2026 WedPlan. All rights reserved.
          </p>

          <p className="text-xs text-[#B9AAA0]">
            Made with{" "}
            <Heart className="mx-1 inline h-3 w-3 fill-[#C98291] text-[#C98291]" />{" "}
            for your special day.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
