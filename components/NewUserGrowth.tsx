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
import { TrendingUp } from "lucide-react"

interface NewUserData {
  date: string
  count: number
  label?: string
}

interface NewUserGrowthProps {
  data: NewUserData[]
  height?: number
}

type ChartType = "line" | "area"

const NewUserGrowth: React.FC<NewUserGrowthProps> = ({ data, height = 300 }) => {
  const [chartType, setChartType] = useState<ChartType>("line")

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
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #4B5563",
              borderRadius: "8px",
              color: "#F3F4F6",
            }}
            labelStyle={{ color: "#F3F4F6", fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ color: "#F3F4F6" }} />
          <Area
            type="monotone"
            dataKey="count"
            stackId="1"
            stroke="#60A5FA"
            fill="#60A5FA"
            fillOpacity={0.6}
            name="New Users"
          />
        </AreaChart>
      )
    }

    return (
      <LineChart {...chartProps}>
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
        <Legend wrapperStyle={{ color: "#F3F4F6" }} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#60A5FA"
          strokeWidth={3}
          name="New Users"
          dot={{ fill: "#60A5FA", r: 4 }}
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
              <TrendingUp className="w-5 h-5 mr-2 text-muted-foreground" />
              New User Trends
            </CardTitle>
            <InfoTooltip content="Historical trends for new users over the selected time period." />
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
        <CardDescription>New users trends over the selected time period</CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default NewUserGrowth
