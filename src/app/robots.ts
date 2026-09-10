import { MetadataRoute } from "next";

const BASE_URL = "https://www.buzzspiremedia.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/", "/invite/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
