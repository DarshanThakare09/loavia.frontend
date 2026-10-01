import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Handcrafted Cookie",
  description:
    "Handcrafted artisanal millet cookie by LOAVIA. Wholesome ingredients, zero refined flour (maida), and delicious taste.",
};

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
