"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { InfoTooltip } from "@/components/info-tooltip"
import { Activity, Zap, Database, AlertTriangle, Brain } from "lucide-react"
import { useSystemHealth } from "@/hooks/use-analytics"
import { DashboardSkeleton } from "@/components/loading-skeleton"

// Mock data - used as fallback if API fails
const topErrors = [
  { error: "Neo4j connection timeout", count: 12, component: "Storage" },
  { error: "SYNAPSE API rate limit", count: 8, component: "Emotion" },
  { error: "WebSocket disconnect", count: 5, component: "Server" },
  { error: "LLM request timeout", count: 3, component: "Cognition" },
  { error: "Context assembly failed", count: 2, component: "Memory" },
]

export function SystemHealthDashboard() {
  const { data: apiData, loading, error } = useSystemHealth('24h', 60000)

  // Show loading skeleton on initial load
  if (loading && !apiData) {
    return <DashboardSkeleton />
  }

  // Use API data if available, otherwise fall back to mock data
  const healthScore = apiData?.systemHealthScore ?? 94
  const activeConnections = apiData?.activeConnections ?? 1247
  const errorRate = apiData?.errorRate ?? 0.12
  const avgResponseTime = apiData?.avgResponseTime ?? 145.2

  // Convert database health from string status to display value
  const dbHealthStatus = apiData?.databaseHealth ?? { neo4j: 'healthy', timescaledb: 'healthy', supabase: 'healthy' }
  const dbHealthScore = typeof dbHealthStatus === 'object' ?
    (Object.values(dbHealthStatus).filter(status => status === 'healthy').length / Object.values(dbHealthStatus).length) * 100 : 98.5

  const dbHealthLabel = dbHealthScore === 100 ? 'All Systems Healthy' :
    dbHealthScore > 66 ? 'Partially Degraded' : 'System Issues'

  // Convert API health from string status to display value
  const apiHealthStatus = apiData?.apiHealth ?? { synapse: 'healthy', llm: 'healthy', snag: 'healthy' }
  const synapseStatusValue = typeof apiHealthStatus === 'object' && apiHealthStatus.synapse === 'healthy' ? 'Operational' :
    (apiHealthStatus.synapse === 'degraded' ? 'Degraded' : 'Down')

  // Recent errors from API (limit to top 5)
  const recentErrorsList = (apiData?.recentErrors ?? topErrors).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Show error banner if API failed but we have fallback data */}
      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded">
          <p className="text-sm">
            <strong>Note:</strong> Unable to load real-time data. Displaying sample data.
          </p>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="System Health Score"
          value={healthScore.toFixed(0)}
          unit="/100"
          change="+2.3%"
          trend="up"
          icon={Activity}
          description="Composite health metric"
          tooltip="Composite score (0-100) calculated from: User engagement (30%), Emotional intelligence (25%), Goal success (20%), System reliability (15%), Loyalty engagement (10%)"
        />
        <MetricCard
          title="Active Connections"
          value={activeConnections.toLocaleString()}
          change="+12"
          trend="up"
          icon={Zap}
          description="Real-time WebSocket connections"
          tooltip="Real-time count of active WebSocket connections. Tracks connection duration, failures/reconnections per hour, and average uptime."
        />
        <MetricCard
          title="Error Rate"
          value={errorRate.toFixed(2)}
          unit="%"
          change="-0.05%"
          trend="down"
          icon={AlertTriangle}
          description="Last 1 hour"
          tooltip="Percentage of failed requests in the last hour. Calculated as (4xx + 5xx errors) / total requests × 100."
        />
      </div>

      {/* System Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            System Performance
            <InfoTooltip content="Key system performance metrics including average API response time and resource utilization." />
          </CardTitle>
          <CardDescription>Current system status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">CPU Usage</p>
              <p className="text-2xl font-bold">{(apiData?.cpuUsage ?? 23.5).toFixed(1)}%</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
              <p className="text-2xl font-bold">{(apiData?.memoryUsage ?? 67.8).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database & API Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <MetricCard
          title="Database Health"
          value={dbHealthScore.toFixed(0)}
          unit="%"
          change={dbHealthScore === 100 ? "0%" : "-" + (100 - dbHealthScore).toFixed(0) + "%"}
          trend={dbHealthScore === 100 ? "neutral" : "down"}
          icon={Database}
          description={dbHealthLabel}
          tooltip="Database health across Neo4j, TimescaleDB, and Supabase. Shows percentage of healthy database connections. 100% = all systems operational."
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              SYNAPSE API Status
              <InfoTooltip content="SYNAPSE emotion analysis API status. Shows current operational state: Operational (healthy), Degraded (partial issues), or Down (unavailable)." />
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{synapseStatusValue}</div>
            <p className="text-xs text-muted-foreground mt-2">Emotion analysis service</p>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  synapseStatusValue === 'Operational' ? 'bg-green-500' :
                  synapseStatusValue === 'Degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-xs">{synapseStatusValue}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Recent Errors
            <InfoTooltip content="Most recent errors from the system. Helps identify and track system issues. Limited to 5 most recent errors." />
          </CardTitle>
          <CardDescription>Last errors from the system</CardDescription>
        </CardHeader>
        <CardContent>
          {recentErrorsList.length > 0 ? (
            <div className="space-y-4">
              {recentErrorsList.map((error: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {error.error || error.message || 'Unknown error'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {error.component || error.type || 'System'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {error.count || 1}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {error.count > 1 ? 'occurrences' : 'occurrence'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent errors</p>
              <p className="text-sm mt-2">System is running smoothly</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
