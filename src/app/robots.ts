import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.loavia.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/auth",
          "/auth/*",
          "/cart",
          "/checkout",
          "/orders",
          "/orders/*",
          "/profile",
          "/api",
          "/api/*",
          "/whatsapp",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
