/**
 * Loading Skeleton Components
 *
 * Skeleton loaders for dashboard components.
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card'

/**
 * Skeleton for MetricCard
 */
export function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2" />
        <div className="h-3 w-16 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton for Chart
 */
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div
          className="w-full bg-muted animate-pulse rounded"
          style={{ height: `${height}px` }}
        />
      </CardContent>
    </Card>
  )
}

/**
 * Full dashboard loading skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary metrics row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Summary metrics row 2 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Charts row 3 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  )
}
