import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { InfoTooltip } from "@/components/info-tooltip"

interface MetricCardProps {
  title: string
  value: string
  unit?: string
  change?: string
  trend?: "up" | "down" | "neutral"
  icon: LucideIcon
  description?: string
  tooltip?: string
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  trend = "neutral",
  icon: Icon,
  description,
  tooltip,
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          {title}
          {tooltip && <InfoTooltip content={tooltip} />}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
        </div>
        {change && (
          <div className="mt-2 flex items-center gap-1">
            <TrendIcon
              className={cn("h-3 w-3", {
                "text-success": trend === "up" || (trend === "down" && title.includes("Cost")),
                "text-destructive": trend === "down" && !title.includes("Cost"),
                "text-muted-foreground": trend === "neutral",
              })}
            />
            <span
              className={cn("text-xs font-medium", {
                "text-success": trend === "up" || (trend === "down" && title.includes("Cost")),
                "text-destructive": trend === "down" && !title.includes("Cost"),
                "text-muted-foreground": trend === "neutral",
              })}
            >
              {change}
            </span>
          </div>
        )}
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
