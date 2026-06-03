import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ShieldCheck } from "lucide-react"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{
      background: "#1B2130", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 14px", boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
    }}>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Round {label}</p>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.fill }} />
          <span style={{ fontSize: 12, color: "#94A3B8" }}>{p.name}:</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnomalyHeatmap({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ padding: 20, height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <ShieldCheck size={24} color="#10B981" />
        <p style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 13 }}>No Anomalies Detected</p>
        <p style={{ color: "#475569", fontSize: 11 }}>System is operating normally.</p>
      </div>
    )
  }

  const sorted = [...data].sort((a, b) => a.round - b.round)
  const chartData = sorted.map(d => ({
    round: d.round,
    Detected: d.blocked || 0,
    Resolved: Math.max(0, (d.blocked || 0) - 1),   // approximate resolved
    Clean: d.blocked === 0 ? 1 : 0
  }))

  const totalAnomalies = chartData.reduce((s, d) => s + d.Detected, 0)

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Anomaly Detection</h3>
          <p style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>Blocked updates per round</p>
        </div>
        {totalAnomalies > 0 ? (
          <span className="badge badge-danger">{totalAnomalies} total blocked</span>
        ) : (
          <span className="badge badge-success">All clear</span>
        )}
      </div>
      <div style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }} barSize={8}>
            <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="round" stroke="transparent" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} />
            <YAxis stroke="transparent" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="Detected" name="Blocked" radius={[3,3,0,0]} fill="#EF4444" fillOpacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
