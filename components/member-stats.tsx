import { TrendingDown, TrendingUp } from "lucide-react"

interface MemberStatsProps {
  title: string
  value: string
  change?: string
  changeDirection?: "up" | "down"
  subtitle: string
  color: "neutral" | "success" | "danger"
}

export default function MemberStats({ title, value, change, changeDirection, subtitle, color }: MemberStatsProps) {
  const bgColor = color === "success" ? "bg-success" : color === "danger" ? "bg-danger" : "bg-card"

  const textColor =
    color === "success"
      ? "text-sidebar-primary-foreground"
      : color === "danger"
        ? "text-sidebar-primary-foreground"
        : "text-card-foreground"

  const subtitleColor = color === "neutral" ? "text-muted-foreground" : "text-sidebar-primary-foreground"

  return (
    <div
      className={`${bgColor} rounded-lg p-4 text-${color === "neutral" ? "foreground" : "sidebar-primary-foreground"}`}
    >
      <h3 className={`text-sm font-medium mb-2 ${textColor}`}>{title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          {change && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${textColor}`}>
              {changeDirection === "down" ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {change}
            </p>
          )}
        </div>
      </div>
      {subtitle && <p className={`text-xs mt-3 ${subtitleColor}`}>* {subtitle}</p>}
    </div>
  )
}
