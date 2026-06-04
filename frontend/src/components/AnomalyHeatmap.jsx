import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { ShieldCheck, ShieldAlert } from "lucide-react"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  const blocked = payload[0]?.value ?? 0
  return (
    <div style={{
      background: "#1B2130", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 14px", boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
    }}>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Round {label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: 2, background: blocked > 0 ? "#EF4444" : "#10B981" }} />
        <span style={{ fontSize: 12, color: "#94A3B8" }}>Blocked:</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: blocked > 0 ? "#EF4444" : "#10B981" }}>{blocked}</span>
      </div>
    </div>
  )
}

export default function AnomalyHeatmap({ data }) {
  // Sort experiments by round
  const sorted = [...(data || [])].sort((a, b) => a.round - b.round)

  // Compute per-round blocked count (differential from cumulative)
  const chartData = sorted.map((d, i) => {
    const prev = i > 0 ? (sorted[i - 1].blocked ?? 0) : 0
    const curr = d.blocked ?? 0
    // If the server resets between rounds it could go negative — clamp to 0
    const perRound = Math.max(0, curr - prev)
    return { round: d.round, Blocked: perRound }
  })

  const totalAnomalies = sorted.length > 0
    ? (sorted[sorted.length - 1].blocked ?? 0)
    : 0

  // No experiment data at all
  if (chartData.length === 0) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Anomaly Detection</h3>
            <p style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>Blocked updates per round</p>
          </div>
          <span className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ShieldCheck size={11} /> All clear
          </span>
        </div>
        <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#475569", fontSize: 12 }}>No rounds completed yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Anomaly Detection</h3>
          <p style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>Blocked updates per round</p>
        </div>
        {totalAnomalies > 0 ? (
          <span className="badge badge-danger" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ShieldAlert size={11} /> {totalAnomalies} total blocked
          </span>
        ) : (
          <span className="badge badge-success" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ShieldCheck size={11} /> All clear
          </span>
        )}
      </div>
      <div style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }} barSize={10}>
            <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="round" stroke="transparent" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} />
            <YAxis stroke="transparent" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.06)" />
            <Bar
              dataKey="Blocked"
              name="Blocked"
              radius={[4, 4, 0, 0]}
              fill="#EF4444"
              fillOpacity={0.85}
              background={{ fill: "rgba(239,68,68,0.04)", radius: [4, 4, 0, 0] }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
