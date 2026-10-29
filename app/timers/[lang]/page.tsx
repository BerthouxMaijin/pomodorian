import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TimerHub, timerHubMetadata } from "@/components/seo/TimerHub";
import { timerLangsWithPages, type TimerLang } from "@/lib/seo/timers";

// Only languages that already have timer pages get a hub; the others 404
// instead of rendering an empty list.
export const dynamicParams = false;

export function generateStaticParams() {
  return timerLangsWithPages()
    .filter((lang) => lang !== "en")
    .map((lang) => ({ lang }));
}

function resolveLang(lang: string): TimerLang | undefined {
  return timerLangsWithPages().find((l) => l === lang && l !== "en");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  return lang ? timerHubMetadata(lang) : {};
}

export default async function LocalizedTimersHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = resolveLang((await params).lang);
  if (!lang) notFound();
  return <TimerHub lang={lang} />;
}
