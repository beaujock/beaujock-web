export const packageIds = ["spider-web", "beaver-dam", "bee-hive"] as const;
export type PackageId = (typeof packageIds)[number];

export type WebPackage = {
  id: PackageId;
  setup: number; // CAD
  maintenance: number; // CAD per year
  maxPages: number;
  databases: number;
  subdomains: number;
  adminSite: boolean;
};

export const packages: Record<PackageId, WebPackage> = {
  "spider-web": { id: "spider-web", setup: 499, maintenance: 199, maxPages: 4, databases: 0, subdomains: 0, adminSite: false },
  "beaver-dam": { id: "beaver-dam", setup: 799, maintenance: 399, maxPages: 8, databases: 1, subdomains: 0, adminSite: true },
  "bee-hive": { id: "bee-hive", setup: 1399, maintenance: 799, maxPages: 16, databases: 3, subdomains: 4, adminSite: true },
};

export const isPackageId = (v: string): v is PackageId => (packageIds as readonly string[]).includes(v);

/** Page suggestions shown as checkboxes on each form (keys into the dictionary's pageOptions). */
export const pageSuggestions: Record<PackageId, string[]> = {
  "spider-web": ["home", "contact", "about", "services"],
  "beaver-dam": ["home", "contact", "about", "services", "news", "upcoming", "gallery", "faq"],
  "bee-hive": ["home", "contact", "about", "services", "news", "upcoming", "gallery", "faq", "team", "careers", "blog", "testimonials"],
};

export const subdomainSuggestions = ["solutions", "regions", "members"];
