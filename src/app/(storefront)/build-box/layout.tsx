import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Custom Cookie Box | Personalized Selection",
  description:
    "Build your custom LOAVIA cookie box. Handpick your favorite wholesome millet cookie flavors in 6 or 12 piece personalized gift boxes.",
  alternates: {
    canonical: "/build-box",
  },
  openGraph: {
    title: "Build Your Custom Cookie Box | LOAVIA",
    description: "Pick and mix your favorite millet cookie flavors in a custom gift box.",
    url: "https://www.loavia.in/build-box",
  },
};

export default function BuildBoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
