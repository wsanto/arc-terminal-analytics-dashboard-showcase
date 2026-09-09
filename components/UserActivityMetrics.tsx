"use client"

import type React from "react"
import { useState } from "react"
import { Users, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserActivityMetricsProps {
  dauMauRatio: {
    dau: number
    wau: number
    mau: number
  }
}

type TimePeriod = "dau" | "wau" | "mau"

const UserActivityMetrics: React.FC<UserActivityMetricsProps> = ({ dauMauRatio }) => {
  const [activePeriod, setActivePeriod] = useState<TimePeriod>("dau")

  const periodConfig = {
    dau: {
      label: "Daily Active Users",
      shortLabel: "DAU",
      description: "Users active in the last 24 hours",
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    wau: {
      label: "Weekly Active Users",
      shortLabel: "WAU",
      description: "Users active in the last 7 days",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    mau: {
      label: "Monthly Active Users",
      shortLabel: "MAU",
      description: "Users active in the last 30 days",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
  }

  const currentConfig = periodConfig[activePeriod]
  const currentValue = dauMauRatio[activePeriod] || 0
  const Icon = currentConfig.icon

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">User Activity</CardTitle>
        <Users className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          {Object.entries(periodConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActivePeriod(key as TimePeriod)}
              className={`
                flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors
                ${
                  activePeriod === key
                    ? `${config.bgColor} ${config.color} ${config.borderColor} border`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }
              `}
            >
              {config.shortLabel}
            </button>
          ))}
        </div>

        {/* Main Metric Display */}
        <div className={`${currentConfig.bgColor} rounded-lg p-6 border ${currentConfig.borderColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{currentConfig.label}</p>
              <p className={`text-3xl font-bold ${currentConfig.color}`}>{currentValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-2">{currentConfig.description}</p>
            </div>
            <div className={`${currentConfig.color} opacity-20`}>
              <Icon className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{dauMauRatio.dau.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Daily</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{dauMauRatio.wau.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Weekly</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{dauMauRatio.mau.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Monthly</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserActivityMetrics
