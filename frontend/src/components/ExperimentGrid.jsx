import React, { useState, useMemo } from "react"
import { Search, ChevronDown, ChevronUp, Download, ChevronLeft, ChevronRight, TableProperties } from "lucide-react"

const PAGE_SIZE = 8

function exportCSV(data) {
  const headers = ["Round", "Accuracy", "Avg Trust", "Blocked"]
  const rows = data.map(e => [e.round, e.accuracy?.toFixed(2) ?? "", Math.round(e.avg_trust ?? 0), e.blocked ?? 0])
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = "experiment_log.csv"
  a.click()
}

export default function ExperimentGrid({ experiments }) {
  const [sort, setSort] = useState({ field: "round", dir: "desc" })
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)

  if (!experiments || experiments.length === 0) {
    return (
      <div className="card" style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TableProperties size={22} color="#8B5CF6" />
        </div>
        <p style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>No Experiment Data</p>
        <p style={{ color: "#475569", fontSize: 12 }}>Training round logs will appear here after the first aggregation completes.</p>
      </div>
    )
  }

  const handleSort = (field) => {
    setSort(s => ({ field, dir: s.field === field && s.dir === "asc" ? "desc" : "asc" }))
    setPage(0)
  }

  const filtered = useMemo(() =>
    experiments.filter(e =>
      e.round?.toString().includes(search) ||
      (e.accuracy?.toFixed(2) || "").includes(search)
    ), [experiments, search])

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => {
      const av = a[sort.field] ?? 0, bv = b[sort.field] ?? 0
      return sort.dir === "asc" ? av - bv : bv - av
    }), [filtered, sort])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const SortBtn = ({ field }) => {
    if (sort.field !== field) return <ChevronDown size={11} color="#334155" style={{ marginLeft: 4 }} />
    return sort.dir === "asc"
      ? <ChevronUp size={11} color="#8B5CF6" style={{ marginLeft: 4 }} />
      : <ChevronDown size={11} color="#8B5CF6" style={{ marginLeft: 4 }} />
  }

  return (
    <div className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap"
      }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Experiment Log</h3>
          <p style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{filtered.length} training rounds</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <Search size={12} color="#475569" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
            <input className="input-field" style={{ paddingLeft: 28, width: 160 }}
              placeholder="Search rounds..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }} />
          </div>
          <button className="btn btn-ghost" onClick={() => exportCSV(sorted)} title="Export CSV">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", flex: 1 }}>
        <table className="data-table">
          <thead>
            <tr>
              {[["round","Round"],["accuracy","Accuracy"],["avg_trust","Avg Trust"],["blocked","Blocked"]].map(([f,label]) => (
                <th key={f} onClick={() => handleSort(f)} style={{ cursor: "pointer" }}>
                  <span style={{ display: "inline-flex", alignItems: "center" }}>{label}<SortBtn field={f} /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((exp, idx) => {
              const trustColor = exp.avg_trust >= 80 ? "#10B981" : exp.avg_trust >= 50 ? "#F59E0B" : "#EF4444"
              const trustBg = exp.avg_trust >= 80 ? "rgba(16,185,129,0.1)" : exp.avg_trust >= 50 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)"
              return (
                <tr key={idx}>
                  <td>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 28, height: 20, borderRadius: 5, fontSize: 11, fontWeight: 700,
                      background: "rgba(139,92,246,0.12)", color: "#A78BFA",
                      border: "1px solid rgba(139,92,246,0.2)"
                    }}>
                      {exp.round}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="progress-bar" style={{ width: 52 }}>
                        <div className="progress-fill" style={{ width: `${exp.accuracy ?? 0}%`, background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>{exp.accuracy?.toFixed(1) ?? 0}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 600,
                      background: trustBg, color: trustColor,
                      border: `1px solid ${trustColor}35`
                    }}>
                      {Math.round(exp.avg_trust ?? 0)}
                    </span>
                  </td>
                  <td>
                    {exp.blocked > 0
                      ? <span style={{ color: "#EF4444", fontWeight: 600, fontSize: 12 }}>{exp.blocked}</span>
                      : <span style={{ color: "#334155" }}>—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {paged.length === 0 && (
          <div style={{ padding: "24px", textAlign: "center", color: "#475569", fontSize: 13 }}>
            No results for "{search}"
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{ fontSize: 12, color: "#475569" }}>
            Page {page + 1} of {totalPages} · {sorted.length} records
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0}>
              <ChevronLeft size={13} />
            </button>
            <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page === totalPages - 1}>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
