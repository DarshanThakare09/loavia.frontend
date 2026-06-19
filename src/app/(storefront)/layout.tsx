"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MiniCart } from "@/components/layout/MiniCart";
import { usePathname } from "next/navigation";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showGlobalNavbar = pathname !== "/";

  return (
    <>
      {showGlobalNavbar && <Navbar />}
      <MiniCart />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
