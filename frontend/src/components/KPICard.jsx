import React, { useRef, useEffect } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

// Tiny sparkline canvas
function Sparkline({ data, color }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length < 2) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    const min = Math.min(...data), max = Math.max(...data)
    const range = max - min || 1
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * W,
      y: H - ((v - min) / range) * (H - 4) - 2
    }))
    ctx.clearRect(0, 0, W, H)
    // fill
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, color + "40")
    grad.addColorStop(1, color + "00")
    ctx.beginPath()
    ctx.moveTo(pts[0].x, H)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(pts[pts.length - 1].x, H)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()
    // line
    ctx.beginPath()
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [data, color])
  return <canvas ref={canvasRef} width={80} height={28} style={{ display: "block" }} />
}

// Circular progress ring for trust
function RingProgress({ value, max = 100, color, size = 44 }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const fill = ((value / max) * circ).toFixed(1)
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }} />
    </svg>
  )
}

export default function KPICard({ title, value, icon: Icon, trend, trendValue, statusColor, sparkData, type }) {
  const colors = {
    accent:  { icon: "#8B5CF6", bg: "rgba(139,92,246,0.12)", ring: "#8B5CF6" },
    success: { icon: "#10B981", bg: "rgba(16,185,129,0.12)",  ring: "#10B981" },
    warning: { icon: "#F59E0B", bg: "rgba(245,158,11,0.12)",  ring: "#F59E0B" },
    danger:  { icon: "#EF4444", bg: "rgba(239,68,68,0.12)",   ring: "#EF4444" },
    default: { icon: "#A78BFA", bg: "rgba(139,92,246,0.08)",  ring: "#A78BFA" },
  }
  const c = colors[statusColor] || colors.default
  const trendUp = trend === "up"
  const trendDown = trend === "down"

  return (
    <div
      className="card card-interactive"
      style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", animationFillMode: "forwards" }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {title}
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          background: c.bg, boxShadow: `0 0 0 4px ${c.ring}18`
        }}>
          {Icon && <Icon size={15} color={c.icon} />}
        </div>
      </div>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
        <div>
          {type === "ring" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <RingProgress value={Number(value) || 0} color={c.ring} />
              <span style={{ fontSize: 28, fontWeight: 700, color: "#F8FAFC", lineHeight: 1 }}>{value}</span>
            </div>
          ) : (
            <span style={{ fontSize: 30, fontWeight: 700, color: "#F8FAFC", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {value}
            </span>
          )}
        </div>
        {sparkData && sparkData.length > 1 && (
          <Sparkline data={sparkData} color={c.ring} />
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {trendUp && <TrendingUp size={12} color="#10B981" />}
          {trendDown && <TrendingDown size={12} color="#EF4444" />}
          {!trendUp && !trendDown && <Minus size={12} color="#475569" />}
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: trendUp ? "#10B981" : trendDown ? "#EF4444" : "#475569"
          }}>
            {trendValue}
          </span>
          <span style={{ fontSize: 11, color: "#475569" }}>vs prev</span>
        </div>
      )}
    </div>
  )
}
