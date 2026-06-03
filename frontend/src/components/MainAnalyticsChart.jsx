import React, { useState } from "react"
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"

const MODES = ["Accuracy", "Trust", "Combined"]
const WINDOWS = ["5R", "10R", "ALL"]

const CustomTooltip = ({ active, payload, label, mode }) => {
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{
      background: "#1B2130", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 14px", boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
    }}>
      <p style={{ fontSize: 11, color: "#64748B", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Round {label}
      </p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ fontSize: 12, color: "#94A3B8" }}>{p.name}:</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>
            {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
            {p.dataKey === "accuracy" ? "%" : ""}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function MainAnalyticsChart({ data }) {
  const [mode, setMode] = useState("Accuracy")
  const [window, setWindow] = useState("ALL")

  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ padding: "24px", height: 360, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <p style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>No Training Data</p>
        <p style={{ color: "#475569", fontSize: 12 }}>Accuracy trends will appear after the first round completes.</p>
      </div>
    )
  }

  const sorted = [...data].sort((a, b) => a.round - b.round)
  const windowed = window === "5R" ? sorted.slice(-5) : window === "10R" ? sorted.slice(-10) : sorted

  return (
    <div className="card" style={{ padding: "20px 20px 12px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Global Accuracy Trend</h3>
          <p style={{ fontSize: 12, color: "#64748B", margin: "3px 0 0" }}>Training performance across rounds</p>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {/* Mode toggles */}
          <div style={{ display: "flex", gap: 4, background: "rgba(15,17,23,0.5)", borderRadius: 8, padding: 3, border: "1px solid rgba(255,255,255,0.06)" }}>
            {MODES.map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={mode === m ? "btn btn-active" : "btn btn-ghost"}
                style={{ padding: "4px 10px", fontSize: 11, borderRadius: 6 }}>
                {m}
              </button>
            ))}
          </div>
          {/* Window toggles */}
          <div style={{ display: "flex", gap: 4, background: "rgba(15,17,23,0.5)", borderRadius: 8, padding: 3, border: "1px solid rgba(255,255,255,0.06)" }}>
            {WINDOWS.map(w => (
              <button key={w} onClick={() => setWindow(w)}
                className={window === w ? "btn btn-active" : "btn btn-ghost"}
                style={{ padding: "4px 10px", fontSize: 11, borderRadius: 6 }}>
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={windowed} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="gradAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradTrust" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="round" stroke="transparent" tick={{ fill: "#475569", fontSize: 11 }} tickLine={false} />
            <YAxis stroke="transparent" tick={{ fill: "#475569", fontSize: 11 }} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip mode={mode} />} cursor={{ stroke: "rgba(139,92,246,0.3)", strokeWidth: 1, strokeDasharray: "4 4" }} />
            {(mode === "Accuracy" || mode === "Combined") && (
              <Area type="monotone" dataKey="accuracy" name="Accuracy" stroke="#8B5CF6" strokeWidth={2.5}
                fill="url(#gradAccuracy)" dot={false}
                activeDot={{ r: 5, fill: "#8B5CF6", stroke: "#0F1117", strokeWidth: 2 }} />
            )}
            {(mode === "Trust" || mode === "Combined") && (
              <Area type="monotone" dataKey="avg_trust" name="Avg Trust" stroke="#10B981" strokeWidth={2}
                fill="url(#gradTrust)" dot={false}
                activeDot={{ r: 5, fill: "#10B981", stroke: "#0F1117", strokeWidth: 2 }} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
