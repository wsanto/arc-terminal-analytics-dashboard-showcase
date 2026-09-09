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
import { useEmotionCount } from "@/hooks/use-analytics"
import { PieChartIcon } from "lucide-react"

interface EmotionCountChartProps {
  timeRange?: string
  height?: number
}

// Plutchik's 8 primary emotions with high-contrast colors for dark background
const EMOTION_COLORS: Record<string, string> = {
  joy: "#FCD34D",        // Bright Yellow
  trust: "#34D399",      // Bright Green
  fear: "#A78BFA",       // Light Purple
  surprise: "#22D3EE",   // Bright Cyan
  sadness: "#60A5FA",    // Bright Blue
  disgust: "#C084FC",    // Bright Magenta
  anger: "#F87171",      // Bright Red
  anticipation: "#FB923C" // Bright Orange
}

export function EmotionCountChart({
  timeRange = '30d',
  height = 350
}: EmotionCountChartProps) {
  const { data, loading, error } = useEmotionCount(timeRange, 300000)

  // Transform data for pie chart
  const chartData = data?.data.map(item => ({
    name: item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1),
    value: item.messageCount,
    percentage: item.percentageOfTotal,
    rawEmotion: item.emotion,
    color: EMOTION_COLORS[item.emotion] || "#60A5FA"
  })) || []

  const totalMessages = chartData.reduce((sum, item) => sum + item.value, 0)

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2" />
            Emotion Message Distribution
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading emotion distribution...</p>
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
            <PieChartIcon className="w-5 h-5 mr-2" />
            Emotion Message Distribution
          </CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-destructive">Unable to load emotion distribution</p>
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
          <PieChartIcon className="w-5 h-5 mr-2" />
          Emotion Message Distribution
          <InfoTooltip content="Distribution of messages across Plutchik's 8 primary emotions. Shows total message count and percentage for each emotion category." />
        </CardTitle>
        <CardDescription>Message counts by emotion type</CardDescription>
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
              outerRadius={120}
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
            <div className="text-2xl font-bold text-gray-100">
              {chartData.length}
            </div>
            <div className="text-sm text-gray-400">Emotion Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">
              {chartData.length > 0 ? chartData[0].name : '-'}
            </div>
            <div className="text-sm text-gray-400">Most Common</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
