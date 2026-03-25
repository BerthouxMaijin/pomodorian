# SEO Audit — Pomodorian

Run this audit weekly to track indexation and search performance.

## 1. Performance Overview

Use the MCP Google Search Console tool:

```
get_performance_summary(site_url: "pomodorian.app", period: "28d")
```

Report: total clicks, impressions, CTR, avg position, and delta vs previous period.

## 2. Top Keywords

```
get_search_analytics(site_url: "pomodorian.app", dimensions: ["query"], row_limit: 25)
```

Identify:
- **Quick wins**: queries with position 5-20 and high impressions but low CTR → optimize title/description
- **Winners**: queries gaining position vs previous period
- **Losers**: queries losing position → investigate

## 3. Page Performance

```
get_search_analytics(site_url: "pomodorian.app", dimensions: ["page"], row_limit: 50)
```

Identify:
- Pages with 0 clicks despite impressions → CTR problem (bad title/description)
- Pages with no impressions at all → indexation or content problem

## 4. Indexation Audit

Batch inspect key URLs (20 at a time):

```
batch_inspect_urls(site_url: "pomodorian.app", urls: [...])
```

Check all blog articles + SEO pages. Report:
- ✅ Indexed
- 🔍 Discovered (in crawl queue)
- ❌ Unknown to Google
- ⚠️ Crawled but not indexed (quality issue)

## 5. Sitemap Health

```
list_sitemaps(site_url: "pomodorian.app")
```

Verify: status = Success, discovered pages count matches expected.

## 6. Trend Analysis

```
get_search_analytics(site_url: "pomodorian.app", dimensions: ["date"], date_granularity: "weekly", start_date: "90 days ago")
```

Plot weekly clicks/impressions trend. Flag any sudden drops.

## 7. Country Breakdown

```
get_search_analytics(site_url: "pomodorian.app", dimensions: ["country"], row_limit: 10)
```

See which countries drive traffic. Compare with blog language coverage (EN/FR/ES/DE).

## 8. Device Split

```
get_search_analytics(site_url: "pomodorian.app", dimensions: ["device"])
```

Check mobile vs desktop. Pomodorian is a PWA — mobile should be strong.

---

## Actions Template

After each audit, create a prioritized action list:

1. **P0 — Indexation**: Request indexing for pages stuck as "unknown"
2. **P1 — Quick wins**: Optimize titles/descriptions for high-impression low-CTR pages
3. **P2 — Content**: Write new articles for keyword gaps
4. **P3 — Technical**: Fix any crawl errors or canonical issues
