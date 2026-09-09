"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoTooltip } from "@/components/info-tooltip"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useSentimentCount } from "@/hooks/use-analytics"
import { TrendingUp } from "lucide-react"

interface SentimentCountChartProps {
  timeRange?: string
  height?: number
}

// Sentiment colors with high contrast for dark background
const SENTIMENT_COLORS: Record<string, string> = {
  positive: "#34D399",   // Bright Green
  neutral: "#9CA3AF",    // Light Gray
  negative: "#F87171"    // Bright Red
}

export function SentimentCountChart({
  timeRange = '30d',
  height = 300
}: SentimentCountChartProps) {
  const { data, loading, error } = useSentimentCount(timeRange, 300000)

  // Transform data for donut chart
  const chartData = data?.data.map(item => ({
    name: item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1),
    value: item.messageCount,
    percentage: item.percentageOfTotal,
    rawSentiment: item.sentiment,
    color: SENTIMENT_COLORS[item.sentiment] || "#60A5FA"
  })) || []

  const totalMessages = chartData.reduce((sum, item) => sum + item.value, 0)

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Sentiment Message Distribution
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading sentiment distribution...</p>
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
            <TrendingUp className="w-5 h-5 mr-2" />
            Sentiment Message Distribution
          </CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-destructive">Unable to load sentiment distribution</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderLabel = (props: any) => {
    const { name, percentage } = props
    return {
      children: `${name}: ${percentage.toFixed(1)}%`,
      fill: '#F3F4F6',
      fontSize: 13,
      fontWeight: 600
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Sentiment Message Distribution
          <InfoTooltip content="Distribution of messages across sentiment categories. Shows total message count and percentage for positive, neutral, and negative sentiments." />
        </CardTitle>
        <CardDescription>Message counts by sentiment</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #4B5563",
                borderRadius: "8px",
                color: "#F3F4F6"
              }}
              labelStyle={{ color: "#F3F4F6", fontWeight: 600 }}
              formatter={(value: number, name: string, props: any) => [
                `${value.toLocaleString()} messages (${props.payload.percentage.toFixed(1)}%)`,
                props.payload.name
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ color: '#F3F4F6' }}
              formatter={(value, entry: any) => (
                <span style={{ color: '#F3F4F6', fontSize: '13px' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">
              {totalMessages.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{
              color: chartData.find(item => item.rawSentiment === 'positive')?.color
            }}>
              {chartData.find(item => item.rawSentiment === 'positive')?.percentage.toFixed(1) || '0'}%
            </div>
            <div className="text-sm text-gray-400">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{
              color: chartData.find(item => item.rawSentiment === 'negative')?.color
            }}>
              {chartData.find(item => item.rawSentiment === 'negative')?.percentage.toFixed(1) || '0'}%
            </div>
            <div className="text-sm text-gray-400">Negative</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
