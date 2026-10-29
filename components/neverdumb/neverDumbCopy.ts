import type { UiLocale } from "@/lib/i18n/locales";
import type { NeverDumbCopy } from "./copy/types";
import { en } from "./copy/en";
import { fr } from "./copy/fr";
import { es } from "./copy/es";
import { de } from "./copy/de";
import { pt } from "./copy/pt";
import { it } from "./copy/it";
import { ja } from "./copy/ja";
import { zh } from "./copy/zh";

export * from "./copy/types";

export const NEVER_DUMB_COPY: Record<UiLocale, NeverDumbCopy> = { en, fr, es, de, pt, it, ja, zh };
