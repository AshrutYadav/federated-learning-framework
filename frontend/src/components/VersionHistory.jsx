import React from "react"
import { GitCommit, Package } from "lucide-react"

export default function VersionHistory({ versions }) {
  if (!versions || versions.length === 0) {
    return (
      <div className="card" style={{ padding: 20, height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Package size={15} color="#8B5CF6" />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Model Versions</h3>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GitCommit size={20} color="#8B5CF6" />
          </div>
          <p style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 13 }}>No Models Saved</p>
          <p style={{ color: "#475569", fontSize: 11, textAlign: "center" }}>Global models will appear here after each aggregation round.</p>
        </div>
      </div>
    )
  }

  const unique = versions
    .filter((v, i, self) => i === self.findIndex(x => x.round === v.round && x.path === v.path))
    .sort((a, b) => b.round - a.round)

  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", maxHeight: 440, minHeight: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Package size={15} color="#8B5CF6" />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Model Versions</h3>
        </div>
        <span className="badge badge-accent">{unique.length} versions</span>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        <div style={{ position: "absolute", left: 11, top: 6, bottom: 6, width: 1, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {unique.map((v, idx) => (
            <div key={idx} style={{ display: "flex", gap: 14, paddingBottom: 16, position: "relative" }}>
              {/* Dot */}
              <div style={{ flexShrink: 0, marginTop: 4 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: idx === 0 ? "#8B5CF6" : "#1B2130",
                  border: idx === 0 ? "2px solid #8B5CF6" : "2px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: idx === 0 ? "0 0 0 4px rgba(139,92,246,0.2)" : "none",
                  zIndex: 1, position: "relative"
                }}>
                  <GitCommit size={10} color={idx === 0 ? "#fff" : "#475569"} />
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>v{v.round}</span>
                  {idx === 0 && <span className="badge badge-accent">Latest</span>}
                </div>
                <div style={{
                  background: "rgba(15,17,23,0.6)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8, padding: "8px 10px"
                }}>
                  <p style={{ fontSize: 10, color: "#475569", margin: "0 0 2px", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {v.path || `global_model_r${v.round}.pth`}
                  </p>
                  <p style={{ fontSize: 10, color: "#64748B", margin: 0 }}>Round {v.round}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
