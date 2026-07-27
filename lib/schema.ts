import { SITE_URL } from "@/lib/constants";

// Canonical @id anchors. Every JSON-LD node on the site references these
// instead of redeclaring the entity, so crawlers resolve one entity per concept.
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PERSON_ID = `${SITE_URL}/about#person`;
export const APP_ID = `${SITE_URL}/#software`;
export const LOGO_ID = `${SITE_URL}/#logo`;

const TAGLINE =
  "Free AI-powered Pomodoro timer with session planning, ambient sounds, and focus analytics.";

export const organizationNode = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Pomodorian",
  url: SITE_URL,
  description: TAGLINE,
  logo: {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: `${SITE_URL}/icons/icon-512.png`,
    contentUrl: `${SITE_URL}/icons/icon-512.png`,
    width: 512,
    height: 512,
    caption: "Pomodorian",
  },
  image: { "@id": LOGO_ID },
  founder: { "@id": PERSON_ID },
  foundingDate: "2026-03-23",
  sameAs: [
    "https://github.com/BerthouxMaijin/pomodorian",
    "https://ko-fi.com/jbbthx",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${SITE_URL}/contact`,
    availableLanguage: ["en", "fr", "es", "de"],
  },
};

export const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Jean-Baptiste Berthoux",
  url: `${SITE_URL}/about`,
  jobTitle: "Founder & Developer",
  description:
    "French builder and creator of Pomodorian, an AI-powered Pomodoro timer.",
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/jb.jpg`,
    caption: "Jean-Baptiste Berthoux",
  },
  sameAs: [
    "https://www.linkedin.com/in/jean-baptiste-berthoux/",
    "https://github.com/BerthouxMaijin",
    "https://jeanbaptisteberthoux.com",
  ],
  worksFor: { "@id": ORG_ID },
  knowsAbout: [
    "Web Development",
    "Artificial Intelligence",
    "Productivity",
    "Pomodoro Technique",
    "Focus and attention management",
  ],
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Pomodorian",
  url: SITE_URL,
  description: TAGLINE,
  publisher: { "@id": ORG_ID },
  inLanguage: ["en", "fr", "es", "de"],
  // No potentialAction/SearchAction: the site has no search results page,
  // and declaring a target that does not resolve violates Google policy.
};

export const softwareAppNode = {
  "@type": "SoftwareApplication",
  "@id": APP_ID,
  name: "Pomodorian",
  url: SITE_URL,
  description: TAGLINE,
  applicationCategory: "ProductivityApplication",
  applicationSubCategory: "Pomodoro timer",
  operatingSystem: "Web browser (Chrome, Safari, Firefox, Edge)",
  browserRequirements: "Requires JavaScript and localStorage support.",
  isAccessibleForFree: true,
  inLanguage: ["en", "fr", "es", "de"],
  datePublished: "2026-03-23",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: SITE_URL,
    category: "Free",
  },
  featureList: [
    "AI Session Planner",
    "Pomodoro Timer",
    "Ambient Sounds (Rain, Café, Lo-fi, Forest, Fireplace)",
    "Focus Analytics with Contribution Heatmap",
    "Never Dumb break exercises",
    "Keyboard Shortcuts",
    "Dark and Light Mode",
  ],
  author: { "@id": PERSON_ID },
  publisher: { "@id": ORG_ID },
  // No aggregateRating until real user reviews are displayed on the page:
  // fabricated ratings risk a manual action.
};

/** The three nodes every page carries so the graph resolves everywhere. */
export const siteNodes = [organizationNode, websiteNode, personNode];

export function breadcrumbNode(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${items[items.length - 1].url}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
