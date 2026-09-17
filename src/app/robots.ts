import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/login"],
        disallow: ["/api/", "/dashboard/", "/attendance/", "/employees/", "/departments/", "/leaves/", "/holidays/", "/reports/", "/audit/", "/settings/", "/profile/"],
      },
    ],
  };
}
