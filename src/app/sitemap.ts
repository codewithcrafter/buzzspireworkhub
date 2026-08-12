import { MetadataRoute } from "next";
import { servicesData } from "@/data/servicesData";

const BASE_URL = "https://buzzspiremedia.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/digital-marketing-agency-in-delhi",
    "/blog",
    "/contact",
    "/career",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const serviceRoutes = servicesData.map((service) => ({
    url: `${BASE_URL}/${service.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...routes, ...serviceRoutes];
}
