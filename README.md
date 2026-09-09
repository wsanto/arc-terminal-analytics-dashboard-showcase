# Analytics Dashboard (showcase excerpt)

An internal analytics dashboard I built for monitoring an AI agent platform in production —
system health, business metrics, and user growth/activity, plus emotion/sentiment analytics charts
visualizing aggregate output from the platform's emotional-intelligence models.

This one is close to complete as-is: nearly the entire app is included, since it's a self-contained
dashboard rather than an excerpt of a much larger private system. The only things held back are
environment-specific config and lockfiles.

## What's included here

- **`components/system-health-dashboard.tsx`, `business-metrics-dashboard.tsx`** — the two main
  dashboard views.
- **Chart components** — `UserGrowthChart`, `NewUserGrowth`, `UserActivityMetrics`,
  `UserListTable`, `EmotionAverageChart`, `EmotionCountChart`, `SentimentAverageChart`,
  `SentimentCountChart`, `MultiDimensionalChart`.
- **`lib/api-client.ts`** — a typed API client for the analytics backend (system health, business
  metrics, and emotion/sentiment endpoints), reading its base URL from an environment variable.
- **`hooks/use-analytics.ts`** — data-fetching hook layer for the dashboards.
- Supporting UI (`metric-card.tsx`, `loading-skeleton.tsx`, `info-tooltip.tsx`, theming, and a
  handful of generic UI primitives).

## What's not included

- Real environment configuration (`.env.local`) and any actual metrics data — this repo ships the
  dashboard code, not live business numbers.
- The backend systems these dashboards read from (the agent platform's analytics API, and the
  emotion/sentiment models producing the underlying scores) — those live in separate private repos.

## Stack

Next.js (App Router), TypeScript, Tailwind, a typed REST API client, chart components for
operational and business-intelligence dashboards.
