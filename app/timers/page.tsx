import { TimerHub, timerHubMetadata } from "@/components/seo/TimerHub";

export const metadata = timerHubMetadata("en");

export default function TimersHubPage() {
  return <TimerHub lang="en" />;
}
