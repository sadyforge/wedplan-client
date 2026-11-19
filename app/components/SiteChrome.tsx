
"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../HomePageComponents/Navbar";
import Footer from "../HomePageComponents/Footer";

function SiteChromeContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isStandaloneRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/profile" ||
    pathname === "/sign-in" ||
    pathname === "/sign-up";

  if (isStandaloneRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<>{children}</>}>
      <SiteChromeContent>{children}</SiteChromeContent>
    </Suspense>
  );
}
