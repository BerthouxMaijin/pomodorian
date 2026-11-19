// End-of-timer notification. Android Chrome throws on `new Notification()`
// and only accepts ServiceWorkerRegistration.showNotification(), so the
// service worker is used when one is active, the constructor otherwise.
// Never throws.

const TAG = "pomodorian-timer";
const ICON = "/icons/icon-192.png";

// `renotify` is valid in browsers but missing from TypeScript's DOM types.
type TimerNotificationOptions = NotificationOptions & { renotify?: boolean };

export async function notify(title: string, body: string): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const options: TimerNotificationOptions = {
    body,
    icon: ICON,
    tag: TAG,
    renotify: true,
  };

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.active) {
        await registration.showNotification(title, options);
        return;
      }
    }
  } catch {
    // Fall through to the constructor.
  }

  try {
    new Notification(title, options);
  } catch {
    // Not supported here (Android without a service worker): nothing to show.
  }
}
