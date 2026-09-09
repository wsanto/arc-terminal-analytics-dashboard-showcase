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
import { useEmotionAverage } from "@/hooks/use-analytics"
import { Heart } from "lucide-react"

interface EmotionAverageChartProps {
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

export function EmotionAverageChart({
  timeRange = '30d',
  height = 350
}: EmotionAverageChartProps) {
  const { data, loading, error } = useEmotionAverage(timeRange, 300000)

  // Transform data for bar chart (convert 0-1 scale to 0-100 for better visualization)
  const chartData = data?.data.map(item => ({
    emotion: item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1),
    value: Math.round(item.averageWeight * 100),
    rawEmotion: item.emotion
  })).sort((a, b) => b.value - a.value) || []

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Average Emotion Weights
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading emotion data...</p>
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
            <Heart className="w-5 h-5 mr-2" />
            Average Emotion Weights
          </CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-destructive">Unable to load emotion data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="w-5 h-5 mr-2" />
          Average Emotion Weights
          <InfoTooltip content="Average emotional intensity across Plutchik's 8 primary emotions. Higher values indicate stronger presence of that emotion in user conversations. Scale: 0-100." />
        </CardTitle>
        <CardDescription>Plutchik's 8 primary emotions - average weights</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" strokeWidth={1} />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#9CA3AF"
              tick={{ fill: '#F3F4F6', fontSize: 12 }}
              label={{ value: 'Average Weight (%)', position: 'insideBottom', offset: -5, fill: '#D1D5DB' }}
            />
            <YAxis
              dataKey="emotion"
              type="category"
              stroke="#9CA3AF"
              width={80}
              tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 500 }}
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
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={EMOTION_COLORS[entry.rawEmotion] || "#60A5FA"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">
              {chartData.length > 0 ? chartData[0].emotion : '-'}
            </div>
            <div className="text-sm text-gray-400">Most Prevalent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-100">
              {chartData.length > 0 ? `${chartData[0].value}/100` : '-'}
            </div>
            <div className="text-sm text-gray-400">Highest Weight</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
