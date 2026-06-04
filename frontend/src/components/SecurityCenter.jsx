import React from "react"
import { AlertTriangle, UserX, CheckCircle2, ShieldCheck, Lock } from "lucide-react"

function SecurityScoreRing({ score }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const fill = ((score / 100) * circ).toFixed(1)
  const color = score >= 90 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444"
  return (
    <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease, stroke 0.3s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>/ 100</span>
      </div>
    </div>
  )
}

function EventRow({ icon: Icon, title, desc, severity, time }) {
  const colors = {
    danger:  { dot: "#EF4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)" },
    warning: { dot: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
    success: { dot: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
    info:    { dot: "#8B5CF6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
  }
  const c = colors[severity] || colors.info
  return (
    <div style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ marginTop: 2, width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: c.bg, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={13} color={c.dot} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#F8FAFC", margin: 0, lineHeight: 1.3 }}>{title}</p>
          <span style={{ fontSize: 10, color: "#475569", whiteSpace: "nowrap", flexShrink: 0 }}>{time}</span>
        </div>
        <p style={{ fontSize: 11, color: "#64748B", margin: "3px 0 0", lineHeight: 1.4 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function SecurityCenter({ experiments, blockedClients, trustScores }) {
  // Count clients whose score is actually ≤ 20 (permanently banned)
  const scores = trustScores || {}
  const permanentlyBanned = (blockedClients || []).filter(c => (scores[c] ?? 100) <= 20)
  const attacksDetected   = (blockedClients || []).filter(c => (scores[c] ?? 100) > 20)

  const blockedCount = permanentlyBanned.length
  const anomalyCount = (experiments || []).filter(e => e.blocked > 0).length
  const totalAttacks = (blockedClients || []).length
  const score = Math.max(0, 100 - blockedCount * 15 - totalAttacks * 5 - anomalyCount * 3)
  const threatLevel = score >= 90 ? "LOW" : score >= 70 ? "MEDIUM" : "HIGH"
  const threatColors = { LOW: "#10B981", MEDIUM: "#F59E0B", HIGH: "#EF4444" }

  // Build events feed
  let events = []

  // Permanently banned clients (score ≤ 20)
  permanentlyBanned.forEach(c => events.push({
    icon: UserX, title: "Client Permanently Banned", severity: "danger",
    desc: `Trust score reached 0 — ${c} is permanently excluded.`, time: "Recent"
  }))

  // Clients that were caught but not yet banned (score > 20)
  attacksDetected.forEach(c => events.push({
    icon: AlertTriangle, title: "Attack Detected & Blocked", severity: "warning",
    desc: `Malicious weights rejected from ${c}. Trust score reduced.`, time: "Recent"
  }))
  const recent = [...(experiments || [])].sort((a,b) => b.round - a.round).slice(0,3)
  recent.forEach(exp => {
    if (exp.blocked > 0) events.push({
      icon: AlertTriangle, title: "Anomaly Detected",
      desc: `${exp.blocked} updates rejected in Round ${exp.round}.`,
      severity: "warning", time: `Rnd ${exp.round}`
    })
    else events.push({
      icon: CheckCircle2, title: "Trust Validation Passed",
      desc: `Round ${exp.round} aggregation completed successfully.`,
      severity: "success", time: `Rnd ${exp.round}`
    })
  })
  if (events.length === 0) events.push({
    icon: ShieldCheck, title: "System Secure",
    desc: "No anomalies detected. All clients trusted.",
    severity: "success", time: "Now"
  })

  return (
    <div className="card" style={{ padding: 20, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={15} color="#8B5CF6" />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Security Center</h3>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 9999,
          color: threatColors[threatLevel],
          background: `${threatColors[threatLevel]}18`,
          border: `1px solid ${threatColors[threatLevel]}40`
        }}>
          {threatLevel} RISK
        </span>
      </div>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20, padding: 16, borderRadius: 10, background: "rgba(15,17,23,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <SecurityScoreRing score={score} />
        <div>
          <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Security Score</p>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 8px" }}>
            {blockedCount} blocked · {anomalyCount} anomalous rounds
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <span className={`badge ${score >= 90 ? "badge-success" : score >= 70 ? "badge-warning" : "badge-danger"}`}>
              {threatLevel} Threat Level
            </span>
          </div>
        </div>
      </div>

      {/* Events */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Recent Events</p>
        <div style={{ overflowY: "auto", maxHeight: 220 }}>
          {events.map((ev, i) => (
            <EventRow key={i} {...ev} />
          ))}
        </div>
      </div>
    </div>
  )
}
