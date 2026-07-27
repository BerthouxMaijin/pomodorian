import { SITE_URL } from "@/lib/constants";
import { FAQ } from "@/lib/faq";
import {
  APP_ID,
  LOGO_ID,
  ORG_ID,
  WEBSITE_ID,
  graph,
  siteNodes,
  softwareAppNode,
} from "@/lib/schema";
import { JsonLd } from "./JsonLd";

const homePage = {
  "@type": ["WebPage", "FAQPage"],
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: "Pomodorian — Free AI Pomodoro Timer | Focus, Plan, Track",
  description:
    "Free Pomodoro timer with AI task planning. Describe your goal, get structured focus sessions. Built-in ambient sounds, analytics, and keyboard shortcuts.",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": APP_ID },
  primaryImageOfPage: { "@id": LOGO_ID },
  inLanguage: "en",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h1 + p"],
  },
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

// Frame extracted from public/promo-reel.mp4; duration and upload date mirror
// the real asset, so keep them in sync if the reel is ever re-cut.
const promoVideo = {
  "@type": "VideoObject",
  "@id": `${SITE_URL}/#promo-video`,
  name: "Pomodorian app walkthrough",
  description:
    "A short walkthrough of Pomodorian: AI session planning, ambient sounds, and the focus analytics heatmap.",
  thumbnailUrl: [`${SITE_URL}/promo-poster.jpg`],
  uploadDate: "2026-03-25T14:38:43+01:00",
  duration: "PT15S",
  contentUrl: `${SITE_URL}/promo-reel.mp4`,
  embedUrl: SITE_URL,
  isFamilyFriendly: true,
  publisher: { "@id": ORG_ID },
};

export function HomeSchemas() {
  return (
    <JsonLd
      data={graph([...siteNodes, softwareAppNode, homePage, promoVideo])}
    />
  );
}
