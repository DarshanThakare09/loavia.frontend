import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Custom LOAVIA Cookie Box | Personalised Selection",
  description:
    "Build your custom LOAVIA Cookies gift box. Handpick your favourite wholesome millet cookie flavours from Nashik in 6, 12, or 24-piece personalised gift boxes.",
  alternates: {
    canonical: "/build-box",
  },
  openGraph: {
    title: "Build Your Custom LOAVIA Cookie Box | Personalised Selection",
    description:
      "Pick and mix your favourite LOAVIA millet cookie flavours in a custom gift box. Handcrafted in Nashik.",
    url: "https://www.loavia.in/build-box",
  },
  twitter: {
    title: "Build Your Custom LOAVIA Cookie Box",
    description:
      "Pick and mix your favourite LOAVIA millet cookie flavours in a custom gift box. Handcrafted in Nashik.",
  },
};

export default function BuildBoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
