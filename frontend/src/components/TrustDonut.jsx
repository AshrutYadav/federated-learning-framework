import React from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null
  const d = payload[0]
  return (
    <div style={{
      background: "#1B2130", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 14px", boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: d.payload.color, marginBottom: 4 }}>{d.name}</p>
      <p style={{ fontSize: 13, color: "#F8FAFC" }}>{d.value} clients ({d.payload.pct}%)</p>
    </div>
  )
}

export default function TrustDonut({ data }) {
  const scores = Object.values(data || {})

  if (scores.length === 0) {
    return (
      <div className="card" style={{ padding: 20, height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <p style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 13 }}>No Clients Registered</p>
        <p style={{ color: "#475569", fontSize: 11, textAlign: "center" }}>Connect your first federated node to see trust distribution.</p>
      </div>
    )
  }

  const trusted  = scores.filter(s => s >= 80).length
  const warning  = scores.filter(s => s >= 50 && s < 80).length
  const blocked  = scores.filter(s => s < 50).length
  const total    = scores.length

  const chartData = [
    { name: "Trusted",  value: trusted, color: "#10B981", pct: Math.round((trusted/total)*100) },
    { name: "Warning",  value: warning, color: "#F59E0B", pct: Math.round((warning/total)*100) },
    { name: "Blocked",  value: blocked, color: "#EF4444", pct: Math.round((blocked/total)*100) },
  ].filter(d => d.value > 0)

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Trust Distribution</h3>
        <p style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>{total} registered clients</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Donut */}
        <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={32} outerRadius={50}
                dataKey="value" startAngle={90} endAngle={-270} paddingAngle={3} strokeWidth={0}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#F8FAFC", lineHeight: 1 }}>{total}</span>
            <span style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>clients</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Trusted",  count: trusted,  color: "#10B981" },
            { label: "Warning",  count: warning,  color: "#F59E0B" },
            { label: "Blocked",  count: blocked,  color: "#EF4444" },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 48, height: 3, borderRadius: 9999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${total > 0 ? (count/total)*100 : 0}%`, background: color, borderRadius: 9999, transition: "width 0.6s ease" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#F8FAFC", minWidth: 16, textAlign: "right" }}>{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
