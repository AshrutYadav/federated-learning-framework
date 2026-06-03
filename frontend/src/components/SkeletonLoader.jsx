import React from "react"

function Skel({ w, h, r = 8, style = {} }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }} />
}

export default function SkeletonLoader() {
  return (
    <div style={{ minHeight: "100vh", background: "#0F1117", padding: "24px", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Skel w={220} h={28} r={8} />
          <Skel w={160} h={16} r={6} />
        </div>
        <Skel w={360} h={38} r={10} />
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        {Array.from({length: 6}).map((_, i) => (
          <div key={i} className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skel w={70} h={12} />
              <Skel w={32} h={32} r={8} />
            </div>
            <Skel w={80} h={30} r={6} />
            <Skel w={100} h={10} r={4} />
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 20 }}>
        <Skel w="100%" h={360} r={12} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Skel w="100%" h={220} r={12} />
          <Skel w="100%" h={200} r={12} />
        </div>
      </div>

      {/* Client Registry */}
      <Skel w="100%" h={160} r={12} style={{ marginBottom: 20 }} />

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "5fr 4fr 3fr", gap: 16 }}>
        <Skel w="100%" h={360} r={12} />
        <Skel w="100%" h={360} r={12} />
        <Skel w="100%" h={360} r={12} />
      </div>
    </div>
  )
}
