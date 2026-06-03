import { useEffect, useState, useCallback } from "react"
import {
  Activity, Users, FileDigit, ShieldAlert, CheckCircle, Database,
  Bell, RefreshCw, Cpu, Clock
} from "lucide-react"
import api from "../services/api"

import KPICard from "../components/KPICard"
import MainAnalyticsChart from "../components/MainAnalyticsChart"
import TrustDonut from "../components/TrustDonut"
import AnomalyHeatmap from "../components/AnomalyHeatmap"
import ClientRegistry from "../components/ClientRegistry"
import SecurityCenter from "../components/SecurityCenter"
import VersionHistory from "../components/VersionHistory"
import ExperimentGrid from "../components/ExperimentGrid"
import SkeletonLoader from "../components/SkeletonLoader"

function StatusPill({ icon: Icon, label, color = "#10B981", pulse = false }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 12px", borderRadius: 9999,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      fontSize: 12, fontWeight: 500, color: "#94A3B8",
      whiteSpace: "nowrap"
    }}>
      {pulse ? (
        <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
          <span style={{
            position: "absolute", inset: 0, borderRadius: "50%", background: color,
            animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite", opacity: 0.7
          }} />
          <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: color }} />
        </span>
      ) : <Icon size={11} color={color} />}
      <span>{label}</span>
    </div>
  )
}

export default function Dashboard() {
  const [metrics, setMetrics]       = useState(null)
  const [versions, setVersions]     = useState([])
  const [blocked, setBlocked]       = useState([])
  const [experiments, setExperiments] = useState([])
  const [trust, setTrust]           = useState({})
  const [loading, setLoading]       = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback((manual = false) => {
    if (manual) setRefreshing(true)
    return Promise.all([
      api.get("/metrics"),
      api.get("/model_versions"),
      api.get("/blocked_clients"),
      api.get("/experiments"),
      api.get("/trust")
    ]).then(([mRes, vRes, bRes, eRes, tRes]) => {
      setMetrics(mRes.data)
      setVersions(vRes.data.versions || [])
      setBlocked(bRes.data.blocked || [])
      setExperiments(eRes.data.experiments || [])
      setTrust(tRes.data.scores || {})
      setLastUpdated(new Date())
      setLoading(false)
      if (manual) setTimeout(() => setRefreshing(false), 500)
    }).catch(err => {
      console.error(err)
      setTimeout(() => setLoading(false), 2000)
      if (manual) setRefreshing(false)
    })
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(() => load(), 5000)
    return () => clearInterval(interval)
  }, [load])

  if (loading) return <SkeletonLoader />

  // Derived stats
  const sortedExp = [...experiments].sort((a, b) => a.round - b.round)
  const latestAcc  = sortedExp.length > 0 ? sortedExp[sortedExp.length - 1]?.accuracy ?? 0 : 0
  const prevAcc    = sortedExp.length > 1 ? sortedExp[sortedExp.length - 2]?.accuracy ?? 0 : 0
  const accTrend   = latestAcc > prevAcc ? "up" : latestAcc < prevAcc ? "down" : "flat"
  const accDiff    = Math.abs(latestAcc - prevAcc).toFixed(1)
  const sparkData  = sortedExp.slice(-10).map(e => e.accuracy ?? 0)
  const blockedCount = (blocked || []).length
  const timeStr = lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—"

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F1117",
      color: "#F8FAFC",
      padding: "20px 24px 40px",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 4px rgba(139,92,246,0.2), 0 8px 20px rgba(139,92,246,0.3)"
          }}>
            <Activity size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0, letterSpacing: "-0.02em" }}>
              Federated AI Monitor
            </h1>
            <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 0" }}>
              Trust-Aware Distributed Learning Platform
            </p>
          </div>
        </div>

        {/* Right: Status + Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Status pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <StatusPill icon={Activity} label="System Healthy" color="#10B981" pulse />
            <StatusPill icon={Database} label="DB Connected" color="#8B5CF6" />
            <StatusPill icon={Users} label={`${metrics?.total_clients ?? 0} Clients`} color="#94A3B8" />
            <StatusPill icon={Clock} label={`Updated ${timeStr}`} color="#94A3B8" />
          </div>

          {/* LIVE badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 9999,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: "0.06em"
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
            LIVE
          </div>

          {/* Refresh */}
          <button
            className="btn btn-ghost"
            style={{ padding: "6px 10px" }}
            onClick={() => load(true)}
            title="Refresh"
          >
            <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.6s linear infinite" : "none" }} />
          </button>

          {/* Notifications */}
          <button className="btn btn-ghost" style={{ padding: "6px 10px", position: "relative" }}>
            <Bell size={14} />
            {blockedCount > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4,
                width: 7, height: 7, borderRadius: "50%", background: "#EF4444"
              }} />
            )}
          </button>

          {/* Avatar */}
          <div style={{
            width: 32, height: 32, borderRadius: "50%", cursor: "pointer",
            background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff"
          }}>
            FM
          </div>
        </div>
      </header>

      {/* ── KPI CARDS ────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 14, marginBottom: 22 }}>
        <KPICard title="Current Round" value={metrics?.current_round ?? 0} icon={Activity} statusColor="accent" />
        <KPICard title="Global Accuracy" value={`${latestAcc.toFixed(1)}%`} icon={CheckCircle}
          trend={accTrend} trendValue={`${accDiff}%`}
          statusColor={latestAcc >= 80 ? "success" : "warning"}
          sparkData={sparkData} />
        <KPICard title="Active Clients" value={metrics?.total_clients ?? 0} icon={Users} statusColor="default" />
        <KPICard title="Total Updates" value={metrics?.total_updates ?? 0} icon={FileDigit} statusColor="default" />
        <KPICard title="Average Trust" value={Math.round(metrics?.avg_trust ?? 0)}
          icon={ShieldAlert} type="ring"
          statusColor={(metrics?.avg_trust ?? 0) >= 80 ? "success" : "warning"} />
        <KPICard title="Blocked Clients" value={blockedCount} icon={ShieldAlert}
          statusColor={blockedCount > 0 ? "danger" : "default"} />
      </div>

      {/* ── ANALYTICS ROW ────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 20, alignItems: "start" }}>
        {/* Large chart — minWidth:0 prevents recharts from getting -1 width in grid */}
        <div style={{ minWidth: 0 }}>
          <MainAnalyticsChart data={experiments} />
        </div>
        {/* Stacked right panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          <TrustDonut data={trust} />
          <AnomalyHeatmap data={experiments} />
        </div>
      </div>

      {/* ── CLIENT REGISTRY ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <ClientRegistry trustData={trust} experiments={experiments} onRefresh={() => load(true)} />
      </div>

      {/* ── BOTTOM ROW ───────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "5fr 4fr 3fr", gap: 16, alignItems: "start" }}>
        <div style={{ minWidth: 0 }}><ExperimentGrid experiments={experiments} /></div>
        <div style={{ minWidth: 0, maxHeight: 440, display: "flex", flexDirection: "column" }}>
          <SecurityCenter experiments={experiments} blockedClients={blocked} />
        </div>
        <div style={{ minWidth: 0 }}>
          <VersionHistory versions={versions} />
        </div>
      </div>

      {/* spin keyframe for refresh button */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}