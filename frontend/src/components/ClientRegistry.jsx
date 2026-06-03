import React, { useState } from "react"
import { Shield, ShieldAlert, ShieldX, Search, Network, X, Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import api from "../services/api"

function getStatus(score) {
  if (score >= 80) return { label: "Trusted", color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", Icon: Shield }
  if (score >= 50) return { label: "Warning", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", Icon: ShieldAlert }
  return { label: "Blocked", color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", Icon: ShieldX }
}

// ── Register Client Modal ─────────────────────────────────────────────────
function RegisterModal({ onClose, onSuccess }) {
  const [clientId, setClientId] = useState("")
  const [status, setStatus] = useState("idle") // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const id = clientId.trim()
    if (!id) return
    setStatus("loading")
    setErrorMsg("")
    try {
      await api.post("/register_client", { client_id: id })
      setStatus("success")
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1200)
    } catch (err) {
      setStatus("error")
      setErrorMsg(err?.response?.data?.detail || "Registration failed. Please try again.")
    }
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
    >
      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#1B2130",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: 28,
          width: 420,
          maxWidth: "calc(100vw - 40px)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          animation: "scale-in 0.2s ease-out"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={16} color="#A78BFA" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Register Client</h3>
              <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 0" }}>Add a new federated node</p>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", display: "block", marginBottom: 6 }}>
              Client ID <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              id="register-client-id"
              className="input-field"
              style={{ width: "100%", padding: "10px 14px", fontSize: 14 }}
              placeholder="e.g. client_4, hospital_node_1..."
              value={clientId}
              onChange={e => { setClientId(e.target.value); setStatus("idle"); setErrorMsg("") }}
              autoFocus
              disabled={status === "loading" || status === "success"}
            />
            <p style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
              Use a unique identifier. The client starts with a trust score of 100.
            </p>
          </div>

          {/* Status feedback */}
          {status === "error" && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", marginBottom: 16 }}>
              <AlertCircle size={14} color="#EF4444" style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: "#EF4444", margin: 0 }}>{errorMsg}</p>
            </div>
          )}
          {status === "success" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", marginBottom: 16 }}>
              <CheckCircle2 size={14} color="#10B981" />
              <p style={{ fontSize: 12, color: "#10B981", margin: 0 }}>Client <strong>{clientId}</strong> registered successfully!</p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={status === "loading"}>
              Cancel
            </button>
            <button
              type="submit"
              id="register-client-submit"
              disabled={!clientId.trim() || status === "loading" || status === "success"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: "rgba(139,92,246,0.2)", color: "#A78BFA",
                border: "1px solid rgba(139,92,246,0.4)", cursor: "pointer",
                opacity: (!clientId.trim() || status === "loading" || status === "success") ? 0.5 : 1,
                transition: "all 0.15s ease"
              }}
            >
              {status === "loading" && <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} />}
              {status === "success" ? "Registered!" : status === "loading" ? "Registering..." : "Register Node"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── ClientRegistry ────────────────────────────────────────────────────────
export default function ClientRegistry({ trustData, experiments, onRefresh }) {
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)

  const clients = Object.entries(trustData || {}).map(([id, score]) => {
    const lastExp = experiments && experiments.length > 0
      ? Math.max(...experiments.map(e => e.round))
      : null
    return { id, score, lastRound: lastExp, updates: experiments ? experiments.length : 0 }
  })

  const filtered = clients.filter(c => c.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      {showModal && (
        <RegisterModal
          onClose={() => setShowModal(false)}
          onSuccess={() => onRefresh && onRefresh()}
        />
      )}

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
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
            <button
              id="register-client-btn"
              className="btn btn-accent"
              style={{ padding: "7px 14px", whiteSpace: "nowrap" }}
              onClick={() => setShowModal(true)}
            >
              <Plus size={13} /> Register Node
            </button>
          </div>
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
                Connect your first federated node to start distributed training and monitor trust scores in real-time.
              </p>
            </div>
            <button className="btn btn-accent" style={{ padding: "9px 22px", fontSize: 13 }} onClick={() => setShowModal(true)}>
              <Plus size={14} /> Register First Client
            </button>
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
    </>
  )
}
