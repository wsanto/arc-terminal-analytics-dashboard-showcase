"use client"

import type React from "react"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoTooltip } from "@/components/info-tooltip"
import { TrendingUp, Users, Calendar } from "lucide-react"

interface UserGrowthData {
  date: string
  dau: number
  wau: number
  mau: number
}

interface UserGrowthChartProps {
  data: UserGrowthData[]
  height?: number
}

type ChartType = "line" | "area"
type MetricType = "dau" | "wau" | "mau"

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data, height = 300 }) => {
  const [chartType, setChartType] = useState<ChartType>("line")
  const [activeMetric, setActiveMetric] = useState<MetricType>("mau")

  const metricConfig = {
    dau: {
      label: "Daily Active Users",
      color: "#60A5FA",
      icon: Calendar,
    },
    wau: {
      label: "Weekly Active Users",
      color: "#A78BFA",
      icon: Users,
    },
    mau: {
      label: "Monthly Active Users",
      color: "#34D399",
      icon: TrendingUp,
    },
  }

  const currentConfig = metricConfig[activeMetric]
  const Icon = currentConfig.icon

  // Calculate growth metrics
  const calculateGrowth = (metric: MetricType) => {
    if (data.length < 2) return { percentage: 0, trend: "up" as const }

    const current = data[data.length - 1][metric]
    const previous = data[data.length - 2][metric]

    if (previous === 0) return { percentage: 0, trend: "up" as const }

    const percentage = ((current - previous) / previous) * 100
    return {
      percentage: Math.round(percentage * 10) / 10,
      trend: percentage >= 0 ? ("up" as const) : ("down" as const),
    }
  }

  const growth = calculateGrowth(activeMetric)
  const currentValue = data.length > 0 ? data[data.length - 1][activeMetric] : 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    if (chartType === "area") {
      return (
        <AreaChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" strokeWidth={1} />
          <XAxis dataKey="date" stroke="#D1D5DB" style={{ fontSize: "12px", fill: "#D1D5DB" }} />
          <YAxis stroke="#D1D5DB" style={{ fontSize: "12px", fill: "#D1D5DB" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "#F3F4F6" }} />
          <Area
            type="monotone"
            dataKey="dau"
            stackId="1"
            stroke={metricConfig.dau.color}
            fill={metricConfig.dau.color}
            fillOpacity={0.6}
            name="Daily Active Users"
          />
        </AreaChart>
      )
    }

    return (
      <LineChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" strokeWidth={1} />
        <XAxis dataKey="date" stroke="#D1D5DB" style={{ fontSize: "12px", fill: "#D1D5DB" }} />
        <YAxis stroke="#D1D5DB" style={{ fontSize: "12px", fill: "#D1D5DB" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#F3F4F6" }} />
        <Line
          type="monotone"
          dataKey="dau"
          stroke={metricConfig.dau.color}
          strokeWidth={3}
          name="Daily Active Users"
          dot={{ fill: metricConfig.dau.color, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="flex items-center">
              <Icon className="w-5 h-5 mr-2 text-muted-foreground" />
              Daily Active User Trends
            </CardTitle>
            <InfoTooltip content="Historical trends for Daily Active Users over the past 30 days." />
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                chartType === "line"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                chartType === "area"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Area
            </button>
          </div>
        </div>
        <CardDescription>Daily Active Users trends over the past 30 days</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Metric Selector & Current Value */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              {Object.entries(metricConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setActiveMetric(key as MetricType)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                    activeMetric === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <config.icon className="w-4 h-4" />
                  <span>{config.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* Current Value & Growth */}
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{currentValue.toLocaleString()}</div>
              <div
                className={`flex items-center text-sm font-medium ${
                  growth.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendingUp className={`w-4 h-4 mr-1 ${growth.trend === "down" ? "rotate-180" : ""}`} />
                {growth.trend === "up" ? "+" : ""}
                {growth.percentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {data.reduce((sum, item) => sum + item.dau, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total DAU</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserGrowthChart
