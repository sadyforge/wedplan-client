
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#EDE3DC] bg-[#F8F4EF]/95 text-[#302925] backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        <Link href="/" className="text-2xl font-bold tracking-tight">
          Wed<span className="text-[#C98291]">Plan</span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative text-sm font-medium transition ${
                pathname === link.href
                  ? "text-[#C98291]"
                  : "text-[#665B55] hover:text-[#C98291]"
              }`}
            >
              {link.name}

              {pathname === link.href && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-[#C98291]" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sign-in"
            className="rounded-full px-5 py-2.5 text-sm font-medium text-[#514640] transition hover:text-[#C98291]"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="rounded-full bg-[#C98291] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B66F7F]"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#302925] transition hover:bg-[#F4E6E2] md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[#EDE3DC] bg-[#F8F4EF] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-[#F4E6E2] text-[#C98291]"
                    : "text-[#665B55] hover:bg-[#F4E6E2]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 border-t border-[#EDE3DC] pt-4">
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-[#E8D5D3] py-2.5 text-center text-sm font-medium text-[#514640]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-[#C98291] py-2.5 text-center text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
