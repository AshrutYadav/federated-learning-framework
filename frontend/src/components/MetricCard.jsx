import React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function MetricCard({ title, value, icon: Icon, trend, trendValue, statusColor }) {
  
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp size={16} className="text-green-500" />
    if (trend === "down") return <TrendingDown size={16} className="text-red-500" />
    return <Minus size={16} className="text-slate-500" />
  }

  const getStatusClass = () => {
    switch (statusColor) {
      case "accent": return "text-sky-400 bg-sky-400/10"
      case "success": return "text-green-500 bg-green-500/10"
      case "warning": return "text-amber-500 bg-amber-500/10"
      case "danger": return "text-red-500 bg-red-500/10"
      default: return "text-slate-400 bg-slate-800"
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-lg shadow-black/20 hover:shadow-black/40 hover:border-slate-600 transition-all duration-300 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-slate-400 tracking-wider uppercase">{title}</h3>
        <div className={`p-2 rounded-lg ${getStatusClass()}`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
        
        {trend && (
          <div className="flex items-center space-x-1 mb-1">
            {getTrendIcon()}
            <span className={`text-sm font-semibold ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-slate-500"}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
