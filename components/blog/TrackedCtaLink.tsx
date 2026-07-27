"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

export function TrackedCtaLink({
  href,
  position,
  lang,
  slug,
  className,
  children,
}: {
  href: string;
  position: "top" | "bottom";
  lang: string;
  slug: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("blog_cta_click", { position, lang, slug })}
    >
      {children}
    </Link>
  );
}
