"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoTooltip } from "@/components/info-tooltip"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { useEmotionalUnderstanding } from "@/hooks/use-analytics"
import { Brain } from "lucide-react"

interface MultiDimensionalChartProps {
  timeRange?: string
  height?: number
}

export function MultiDimensionalChart({
  timeRange = '30d',
  height = 350
}: MultiDimensionalChartProps) {
  const { data, loading, error } = useEmotionalUnderstanding(timeRange, 300000)

  // Transform data for radar chart (convert 0-1 scale to 0-100 for better visualization)
  const chartData = data?.data.map(item => ({
    dimension: item.dimension,
    value: Math.round(item.averageValue * 100)
  })) || []

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Multi-Dimensional Emotional Understanding
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading emotional understanding data...</p>
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
            <Brain className="w-5 h-5 mr-2" />
            Multi-Dimensional Emotional Understanding
          </CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-destructive">Unable to load emotional understanding data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Multi-Dimensional Emotional Understanding
          <InfoTooltip content="Five-dimensional emotional analysis: Valence (positive/negative tone), Arousal (energy level), Intensity (emotion strength), Complexity (number of active emotions), and Wonder Index (openness to discovery). Values shown on 0-100 scale." />
        </CardTitle>
        <CardDescription>Average emotional dimensions across all interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#4B5563" strokeWidth={1.5} />
            <PolarAngleAxis
              dataKey="dimension"
              stroke="#9CA3AF"
              tick={{ fill: '#F3F4F6', fontSize: 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              stroke="#6B7280"
              tick={{ fill: '#D1D5DB', fontSize: 11 }}
            />
            <Radar
              name="Emotional Understanding"
              dataKey="value"
              stroke="#60A5FA"
              strokeWidth={3}
              fill="#3B82F6"
              fillOpacity={0.4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #4B5563",
                borderRadius: "8px",
                color: "#F3F4F6"
              }}
              labelStyle={{ color: "#F3F4F6", fontWeight: 600 }}
              formatter={(value: number) => [`${value}/100`, 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Dimension Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="font-medium text-gray-100">Valence</p>
            <p className="text-xs text-gray-400">Emotional tone (positive/negative)</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-100">Arousal</p>
            <p className="text-xs text-gray-400">Energy level (calm to excited)</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-100">Intensity</p>
            <p className="text-xs text-gray-400">Strength of emotion</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-gray-100">Complexity</p>
            <p className="text-xs text-gray-400">Number of active emotions</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="font-medium text-gray-100">Wonder Index</p>
            <p className="text-xs text-gray-400">Openness to discovery and curiosity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
