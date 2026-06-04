import React, { useState } from "react"
import { Shield, ShieldAlert, ShieldX, Search, Network } from "lucide-react"

function getStatus(score) {
  if (score >= 80) return { label: "Healthy",    color: "#10B981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)",  Icon: Shield }
  if (score >= 50) return { label: "Warning",    color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  Icon: ShieldAlert }
  if (score >= 21) return { label: "Suspicious", color: "#F97316", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.25)",  Icon: ShieldAlert }
  return             { label: "Blocked",    color: "#EF4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)",   Icon: ShieldX }
}

// ── ClientRegistry ────────────────────────────────────────────────────────
export default function ClientRegistry({ trustData, experiments, onRefresh }) {
  const [search, setSearch] = useState("")

  const clients = Object.entries(trustData || {}).map(([id, score]) => {
    const lastExp = experiments && experiments.length > 0
      ? Math.max(...experiments.map(e => e.round))
      : null
    return { id, score, lastRound: lastExp, updates: experiments ? experiments.length : 0 }
  })

  const filtered = clients.filter(c => c.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap"
      }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Client Registry</h3>
          <p style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{clients.length} federated nodes registered</p>
        </div>
        {clients.length > 0 && (
          <div style={{ position: "relative" }}>
            <Search size={13} color="#475569" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              className="input-field"
              style={{ paddingLeft: 30, width: 200 }}
              placeholder="Search clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Empty state */}
      {clients.length === 0 ? (
        <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18, background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Network size={32} color="#8B5CF6" />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", margin: "0 0 6px" }}>No Clients Registered</p>
            <p style={{ fontSize: 13, color: "#475569", maxWidth: 340 }}>
              No federated nodes are currently registered. Start the client scripts to begin distributed training.
            </p>
          </div>
        </div>
      ) : (
        /* Table */
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Trust Score</th>
                <th>Status</th>
                <th>Last Round</th>
                <th>Updates</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const st = getStatus(c.score)
                const Icon = st.Icon
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#8B5CF6" }}>{c.id.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <span style={{ fontWeight: 600, color: "#F8FAFC", fontFamily: "monospace", fontSize: 12 }}>{c.id}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div className="progress-fill" style={{ width: `${c.score}%`, background: st.color }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC", minWidth: 28 }}>{c.score}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 10px", borderRadius: 9999,
                        fontSize: 11, fontWeight: 600,
                        background: st.bg, color: st.color, border: `1px solid ${st.border}`
                      }}>
                        <Icon size={11} /> {st.label}
                      </span>
                    </td>
                    <td style={{ color: "#94A3B8" }}>{c.lastRound ? `Round ${c.lastRound}` : "—"}</td>
                    <td style={{ color: "#94A3B8" }}>{c.updates}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#475569", padding: "24px" }}>
                    No clients match "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
