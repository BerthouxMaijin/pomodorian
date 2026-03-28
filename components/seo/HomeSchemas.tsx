import { SITE_URL } from "@/lib/constants";

const softwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Pomodorian",
  description:
    "AI-powered Pomodoro timer with session planning, ambient sounds, and focus analytics.",
  url: SITE_URL,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI Session Planner",
    "Pomodoro Timer",
    "Ambient Sounds (Rain, Café, Lo-fi, Nature, Fireplace)",
    "Focus Analytics with Contribution Heatmap",
    "Keyboard Shortcuts",
    "Works Offline (PWA)",
    "Dark and Light Mode",
  ],
};

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Pomodoro Technique?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Pomodoro Technique is a time management method that uses 25-minute focused work sessions (called pomodoros) separated by 5-minute breaks. After 4 pomodoros, you take a longer 15-30 minute break. It was developed by Francesco Cirillo in the late 1980s.",
      },
    },
    {
      "@type": "Question",
      name: "Is Pomodorian free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Pomodorian is completely free. No account required, no ads, and no hidden fees. All features including AI session planning, ambient sounds, and focus analytics are available at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI Session Planner work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Describe your goal in natural language (e.g., 'Prepare a presentation and write follow-up emails'), and the AI breaks it down into concrete, pomodoro-sized tasks with time estimates. It supports 8 languages and uses Claude AI.",
      },
    },
    {
      "@type": "Question",
      name: "Does Pomodorian work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Pomodorian is a Progressive Web App (PWA) that can be installed on your device and works offline. The timer, tasks, ambient sounds, and analytics all work without an internet connection. Only the AI planner requires connectivity.",
      },
    },
    {
      "@type": "Question",
      name: "What ambient sounds are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pomodorian includes 5 free ambient sounds: rain, café, lo-fi beats, nature, and fireplace. You can layer multiple sounds together and adjust individual volume levels to create your perfect focus environment.",
      },
    },
  ],
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pomodorian",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icons/icon-512.png`,
    width: 512,
    height: 512,
  },
  description:
    "Free AI-powered Pomodoro timer with session planning, ambient sounds, and focus analytics.",
  founder: {
    "@type": "Person",
    name: "Jean-Baptiste Berthoux",
    url: `${SITE_URL}/about`,
    sameAs: [
      "https://github.com/BerthouxMaijin",
      "https://linkedin.com/in/jbberthoux",
    ],
  },
  sameAs: [
    "https://github.com/BerthouxMaijin/pomodorian",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${SITE_URL}/contact`,
  },
};

const webSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pomodorian",
  url: SITE_URL,
  description:
    "Free AI-powered Pomodoro timer with session planning, ambient sounds, and focus analytics.",
  inLanguage: ["en", "fr", "es", "de"],
};

export function HomeSchemas() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  );
}
