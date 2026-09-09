"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { InfoTooltip } from "@/components/info-tooltip"
import UserActivityMetrics from "@/components/UserActivityMetrics"
import NewUserGrowth from "@/components/NewUserGrowth"
import UserGrowthChart from "@/components/UserGrowthChart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Target, Heart, Award } from "lucide-react"
import { useBusinessMetrics, useGoalMetrics, useNewUserGrowth, useUserEngagement } from "@/hooks/use-analytics"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { MultiDimensionalChart } from "@/components/MultiDimensionalChart"
import { EmotionAverageChart } from "@/components/EmotionAverageChart"
import { EmotionCountChart } from "@/components/EmotionCountChart"
import { SentimentAverageChart } from "@/components/SentimentAverageChart"
import { SentimentCountChart } from "@/components/SentimentCountChart"
import { UserListTable } from "@/components/UserListTable"

// Mock data - used as fallback if API fails
const userGrowthData = [
  { date: "Jan", dau: 450, wau: 1200, mau: 3500 },
  { date: "Feb", dau: 520, wau: 1350, mau: 3800 },
  { date: "Mar", dau: 580, wau: 1500, mau: 4200 },
  { date: "Apr", dau: 650, wau: 1680, mau: 4600 },
  { date: "May", dau: 720, wau: 1850, mau: 5100 },
  { date: "Jun", dau: 810, wau: 2100, mau: 5800 },
]

const loyaltyPointsData = [
  { date: "2025-10-01", pointsEarned: 1250, pointsRedeemed: 320 },
  { date: "2025-10-08", pointsEarned: 1380, pointsRedeemed: 450 },
  { date: "2025-10-15", pointsEarned: 1520, pointsRedeemed: 580 },
  { date: "2025-10-22", pointsEarned: 1650, pointsRedeemed: 720 },
]

const goalCompletionFunnel = [
  { stage: "Created", count: 1000, fill: "hsl(var(--chart-1))" },
  { stage: "Active", count: 750, fill: "hsl(var(--chart-2))" },
  { stage: "Completed", count: 320, fill: "hsl(var(--chart-4))" },
]

export function BusinessMetricsDashboard() {
  const { data: apiData, loading, error } = useBusinessMetrics("30d", 300000)
  const { data: goalData, loading: goalLoading } = useGoalMetrics("30d", 300000)
  const { data: newUserData } = useNewUserGrowth("30d", 300000)
  const { data: engagementData } = useUserEngagement("30d", 300000)

  // Show loading skeleton on initial load
  if ((loading && !apiData) || (goalLoading && !goalData)) {
    return <DashboardSkeleton />
  }

  // Use API data if available, otherwise fall back to mock data
  const platformHealth = apiData?.platformHealthScore ?? 87
  const dauMauRatio = engagementData ? { dau: engagementData.dau, wau: engagementData.wau, mau: engagementData.mau } : (apiData?.dauMauRatio ?? { dau: 0, wau: 0, mau: 0 })
  const totalBreakthroughs = apiData?.totalBreakthroughs ?? { daily: 89, weekly: 456, monthly: 1247 }
  const userGrowth = engagementData?.time_series ?? (apiData?.userGrowthData ?? userGrowthData)
  const newUsers = newUserData?.time_series ?? []
  const loyaltyPoints = apiData?.loyaltyPointsData ?? loyaltyPointsData
  const goalCompletion = apiData?.goalCompletionRate ?? 32
  const wonderIndex = apiData?.avgWonderIndex ?? 7.8
  const costPerUser = apiData?.costPerUser ?? 2.45

  // Transform goal data from API into funnel format
  const goalFunnel = goalData
    ? [
        { stage: "Created", count: goalData.goals_created.total, fill: "hsl(var(--chart-1))" },
        {
          stage: "Active",
          count: goalData.goals_created.by_status.find((s) => s.status === "active")?.count ?? 0,
          fill: "hsl(var(--chart-2))",
        },
        {
          stage: "Completed",
          count: goalData.goals_created.by_status.find((s) => s.status === "completed")?.count ?? 0,
          fill: "hsl(var(--chart-4))",
        },
      ]
    : goalCompletionFunnel

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
          title="Platform Health Score"
          value={platformHealth.toFixed(0)}
          unit="/100"
          change="+5.2%"
          trend="up"
          icon={TrendingUp}
          description="Composite KPI"
          tooltip="Composite score (0-100) combining: User engagement (30%), Emotional intelligence (25%), Goal success (20%), System reliability (15%), Loyalty engagement (10%). Tracks week-over-week and month-over-month changes."
        />
      </div>

      {/* User Activity & New User Growth */}
      <div className="grid gap-4 lg:grid-cols-2">
        <UserActivityMetrics dauMauRatio={dauMauRatio} />
        <NewUserGrowth data={newUsers} height={300} />
      </div>

      {/* User List Table */}
      <UserListTable refreshInterval={300000} />

      {/* User Growth & Loyalty Points */}
      <div className="grid gap-4 lg:grid-cols-2">
        <UserGrowthChart data={userGrowth} height={300} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Loyalty Points Activity
              <InfoTooltip content="Points earned vs redeemed over time. Tracks user engagement with the loyalty program." />
            </CardTitle>
            <CardDescription>Earned and redeemed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={loyaltyPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" strokeWidth={1} />
                <XAxis dataKey="date" stroke="#D1D5DB" style={{ fontSize: "12px", fill: "#D1D5DB" }} />
                <YAxis stroke="#D1D5DB" style={{ fontSize: "12px", fill: "#D1D5DB" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #4B5563",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                  labelStyle={{ color: "#F3F4F6", fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ color: "#F3F4F6" }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="pointsEarned"
                  stroke="#60A5FA"
                  strokeWidth={3}
                  name="Points Earned"
                  dot={{ fill: "#60A5FA", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="pointsRedeemed"
                  stroke="#34D399"
                  strokeWidth={3}
                  name="Points Redeemed"
                  dot={{ fill: "#34D399", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Goal Completion Rate"
          value={goalCompletion.toFixed(0)}
          unit="%"
          change="+4.5%"
          trend="up"
          icon={Target}
          description="From created to completed"
          tooltip="Percentage of goals that reach completed status. Calculated as (completed goals / total goals created) × 100. Tracks average time to completion and goal progress velocity."
        />
        <MetricCard
          title="Avg Wonder Index"
          value={wonderIndex.toFixed(2)}
          change="+0.12"
          trend="up"
          icon={Heart}
          description="Curiosity metric"
          tooltip="Average wonder index across all sessions (0.0-1.0 scale). Measures curiosity and discovery level. Higher values indicate more exploratory, growth-oriented conversations."
        />
        <MetricCard
          title="Cost per User"
          value={`$${costPerUser.toFixed(2)}`}
          change="-$0.18"
          trend="down"
          icon={Award}
          description="Monthly LLM costs"
          tooltip="Monthly LLM token cost divided by active users. Calculated from total tokens consumed × pricing model. Tracks cost efficiency and token usage optimization."
        />
      </div>

      {/* Goal Completion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Goal Completion Funnel
            <InfoTooltip content="User goal progression from creation to completion. Shows total goals created, currently active, and completed. Connected to goals/engagement-metrics API." />
          </CardTitle>
          <CardDescription>User goal progression</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={goalFunnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" strokeWidth={1} />
              <XAxis dataKey="stage" stroke="#D1D5DB" style={{ fontSize: "12px", fill: "#D1D5DB" }} />
              <YAxis stroke="#D1D5DB" style={{ fontSize: "12px", fill: "#D1D5DB" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #4B5563",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
                labelStyle={{ color: "#F3F4F6", fontWeight: 600 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                <Cell fill="#60A5FA" />
                <Cell fill="#A78BFA" />
                <Cell fill="#34D399" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Phase 3: Emotion & Sentiment Analytics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <MultiDimensionalChart timeRange="30d" />
        <EmotionAverageChart timeRange="30d" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EmotionCountChart timeRange="30d" />
        <SentimentAverageChart timeRange="30d" />
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <SentimentCountChart timeRange="30d" />
      </div>
    </div>
  )
}
