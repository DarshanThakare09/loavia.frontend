import type { Metadata } from "next";

const SITE_URL = "https://www.loavia.in";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://api.loavia.in/api/v1";

async function fetchProductBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "LOAVIA Millet Cookie | Premium Handcrafted Cookie",
      description:
        "Handcrafted artisanal millet cookie by LOAVIA Cookies. Wholesome ingredients, zero refined flour (maida), and delicious taste. From Nashik, Maharashtra.",
    };
  }

  const title = `${product.name} | LOAVIA Cookies`;
  const description =
    product.description
      ? `${product.description.slice(0, 140)} \u2014 Handcrafted millet cookie by LOAVIA Cookies, Nashik.`
      : `${product.name} \u2014 handcrafted millet cookie by LOAVIA Cookies. Wholesome ingredients, zero maida, from Nashik.`;
  const canonicalSlug = `/product/${slug}`;
  const image = product.coverImage || product.primaryImage || product.image || `${SITE_URL}/loavia-brand-logo.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalSlug,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalSlug}`,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
