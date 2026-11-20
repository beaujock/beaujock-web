import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Beaujock Enterprises",
    short_name: "Beaujock",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F3FA",
    theme_color: "#2A1B4D",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
