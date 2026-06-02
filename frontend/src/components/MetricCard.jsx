import React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function MetricCard({ title, value, icon: Icon, trend, trendValue, statusColor }) {
  
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp size={14} className="text-emerald-400" />
    if (trend === "down") return <TrendingDown size={14} className="text-rose-400" />
    return <Minus size={14} className="text-indigo-500" />
  }

  const getStatusClass = () => {
    switch (statusColor) {
      case "accent": return "text-fuchsia-400 bg-fuchsia-400/10"
      case "success": return "text-emerald-400 bg-emerald-400/10"
      case "warning": return "text-amber-400 bg-amber-400/10"
      case "danger": return "text-rose-400 bg-rose-400/10"
      default: return "text-indigo-400 bg-indigo-900/30"
    }
  }

  return (
    <div className="bg-[#1A1325]/80 backdrop-blur-md border border-fuchsia-900/20 rounded-xl p-4 shadow-lg shadow-black/40 hover:shadow-fuchsia-900/20 hover:border-fuchsia-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between animate-fade-in-up">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-indigo-300/70 tracking-wider uppercase">{title}</h3>
        <div className={`p-1.5 rounded-lg ${getStatusClass()}`}>
          {Icon && <Icon size={16} />}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold text-fuchsia-50 tracking-tight">{value}</h2>
        
        {trend && (
          <div className="flex items-center space-x-1 mb-1">
            {getTrendIcon()}
            <span className={`text-xs font-semibold ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-indigo-500"}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
