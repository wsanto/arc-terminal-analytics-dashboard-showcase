"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoTooltip } from "@/components/info-tooltip"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { useSentimentAverage } from "@/hooks/use-analytics"
import { Smile } from "lucide-react"

interface SentimentAverageChartProps {
  timeRange?: string
  height?: number
}

// Sentiment colors with high contrast for dark background
const SENTIMENT_COLORS: Record<string, string> = {
  positive: "#34D399",   // Bright Green
  neutral: "#9CA3AF",    // Light Gray
  negative: "#F87171"    // Bright Red
}

export function SentimentAverageChart({
  timeRange = '30d',
  height = 300
}: SentimentAverageChartProps) {
  const { data, loading, error } = useSentimentAverage(timeRange, 300000)

  // Transform data for bar chart (convert 0-1 scale to 0-100 for better visualization)
  const chartData = data?.data.map(item => ({
    sentiment: item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1),
    value: Math.round(item.averageWeight * 100),
    rawSentiment: item.sentiment
  })) || []

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smile className="w-5 h-5 mr-2" />
            Average Sentiment Weights
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading sentiment data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smile className="w-5 h-5 mr-2" />
            Average Sentiment Weights
          </CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-destructive">Unable to load sentiment data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smile className="w-5 h-5 mr-2" />
          Average Sentiment Weights
          <InfoTooltip content="Average sentiment distribution across conversations. Positive (valence > 0.3), Neutral (-0.3 to 0.3), Negative (< -0.3). Higher values indicate stronger sentiment presence. Scale: 0-100." />
        </CardTitle>
        <CardDescription>Overall sentiment tone of conversations</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" strokeWidth={1} />
            <XAxis
              dataKey="sentiment"
              stroke="#9CA3AF"
              tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              stroke="#9CA3AF"
              domain={[0, 100]}
              tick={{ fill: '#F3F4F6', fontSize: 12 }}
              label={{ value: 'Average Weight (%)', angle: -90, position: 'insideLeft', fill: '#D1D5DB' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #4B5563",
                borderRadius: "8px",
                color: "#F3F4F6"
              }}
              labelStyle={{ color: "#F3F4F6", fontWeight: 600 }}
              formatter={(value: number) => [`${value}/100`, 'Weight']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SENTIMENT_COLORS[entry.rawSentiment] || "#60A5FA"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          {chartData.map((item) => (
            <div key={item.sentiment} className="text-center">
              <div className="text-2xl font-bold" style={{ color: SENTIMENT_COLORS[item.rawSentiment] }}>
                {item.value}/100
              </div>
              <div className="text-sm text-gray-400">{item.sentiment}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
