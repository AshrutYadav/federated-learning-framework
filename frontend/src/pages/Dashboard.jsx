import { useEffect, useState } from "react"
import { Activity, Users, FileDigit, ShieldAlert, CheckCircle, Database } from "lucide-react"
import api from "../services/api"

import MetricCard from "../components/MetricCard"
import AccuracyChart from "../components/AccuracyChart"
import TrustChart from "../components/TrustChart"
import SecurityChart from "../components/SecurityChart"
import TrustLeaderboard from "../components/TrustLeaderboard"
import SecurityEvents from "../components/SecurityEvents"
import ModelTimeline from "../components/ModelTimeline"
import ExperimentTable from "../components/ExperimentTable"
import SkeletonLoader from "../components/SkeletonLoader"

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [versions, setVersions] = useState([])
  const [blocked, setBlocked] = useState([])
  const [experiments, setExperiments] = useState([])
  const [trust, setTrust] = useState({})
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([
      api.get("/metrics"),
      api.get("/model_versions"),
      api.get("/blocked_clients"),
      api.get("/experiments"),
      api.get("/trust")
    ]).then(([mRes, vRes, bRes, eRes, tRes]) => {
      setMetrics(mRes.data)
      setVersions(vRes.data.versions)
      setBlocked(bRes.data.blocked)
      setExperiments(eRes.data.experiments)
      setTrust(tRes.data.scores)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      // Fallback loader removal if API fails completely to prevent infinite skeleton
      setTimeout(() => setLoading(false), 2000)
    })
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <SkeletonLoader />
  }

  const latestAccuracy = experiments.length > 0 ? experiments[experiments.length - 1].accuracy : 0
  const prevAccuracy = experiments.length > 1 ? experiments[experiments.length - 2].accuracy : 0
  const accuracyTrend = latestAccuracy > prevAccuracy ? "up" : latestAccuracy < prevAccuracy ? "down" : "flat"
  const accuracyDiff = Math.abs(latestAccuracy - prevAccuracy).toFixed(1)

  return (
    <div className="min-h-screen bg-[#0B0814] text-indigo-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-violet-500/30">
      
      {/* HEADER */}
      <header className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Activity className="text-white" size={16} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-violet-50">Federated Monitoring</h1>
          </div>
          <p className="text-indigo-400/80 text-sm">Trust-Aware Distributed Training System</p>
        </div>

        <div className="flex items-center space-x-3 bg-[#1A1325]/80 p-2 rounded-lg border border-violet-900/20 backdrop-blur-sm shadow-lg shadow-black/20">
          <div className="flex items-center space-x-2 px-2 py-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-emerald-400/90 uppercase tracking-wider">System Online</span>
          </div>
          <div className="w-px h-4 bg-violet-900/30"></div>
          <div className="flex items-center space-x-1.5 px-2 py-0.5">
            <Database size={12} className="text-indigo-400" />
            <span className="text-[11px] font-medium text-indigo-300 uppercase tracking-wider">DB Connected</span>
          </div>
          <div className="w-px h-4 bg-violet-900/30"></div>
          <div className="flex items-center space-x-1.5 px-2 py-0.5">
            <Users size={12} className="text-indigo-400" />
            <span className="text-[11px] font-medium text-indigo-300 uppercase tracking-wider">{metrics?.total_clients || 0} Clients</span>
          </div>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 mb-6">
        <MetricCard 
          title="Current Round" 
          value={metrics?.current_round || 0} 
          icon={Activity}
          statusColor="accent"
        />
        <MetricCard 
          title="Global Accuracy" 
          value={`${latestAccuracy?.toFixed(2)}%`} 
          icon={CheckCircle}
          trend={accuracyTrend}
          trendValue={`${accuracyDiff}%`}
          statusColor={latestAccuracy > 80 ? "success" : "warning"}
        />
        <MetricCard 
          title="Active Clients" 
          value={metrics?.total_clients || 0} 
          icon={Users}
          statusColor="default"
        />
        <MetricCard 
          title="Total Updates" 
          value={metrics?.total_updates || 0} 
          icon={FileDigit}
          statusColor="default"
        />
        <MetricCard 
          title="Average Trust" 
          value={Math.round(metrics?.avg_trust || 0)} 
          icon={ShieldAlert}
          statusColor={(metrics?.avg_trust || 0) > 80 ? "success" : "warning"}
        />
        <MetricCard 
          title="Blocked Clients" 
          value={metrics?.blocked_clients || 0} 
          icon={ShieldAlert}
          statusColor={(metrics?.blocked_clients || 0) > 0 ? "danger" : "default"}
        />
      </div>

      {/* MAIN ANALYTICS ROW (3 CHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1A1325]/80 backdrop-blur-md border border-violet-900/20 rounded-xl p-4 shadow-lg shadow-black/40 animate-fade-in-up">
          <h3 className="font-semibold text-violet-50 text-sm mb-4">Accuracy vs Round</h3>
          <AccuracyChart data={experiments} />
        </div>
        
        <div className="bg-[#1A1325]/80 backdrop-blur-md border border-violet-900/20 rounded-xl p-4 shadow-lg shadow-black/40 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <h3 className="font-semibold text-violet-50 text-sm mb-4">Trust Distribution</h3>
          <TrustChart data={trust} />
        </div>

        <div className="bg-[#1A1325]/80 backdrop-blur-md border border-violet-900/20 rounded-xl p-4 shadow-lg shadow-black/40 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="font-semibold text-violet-50 text-sm mb-4">Anomalies Detected</h3>
          <SecurityChart data={experiments} />
        </div>
      </div>

      {/* ROW 2: LEADERBOARD, EVENTS, TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-1" style={{ animationDelay: '150ms' }}>
          <TrustLeaderboard trustData={trust} />
        </div>
        <div className="lg:col-span-2" style={{ animationDelay: '200ms' }}>
          <ExperimentTable experiments={experiments} />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <div className="h-[48%]" style={{ animationDelay: '250ms' }}>
            <SecurityEvents experiments={experiments} blockedClients={blocked} />
          </div>
          <div className="h-[48%]" style={{ animationDelay: '300ms' }}>
            <ModelTimeline versions={versions} />
          </div>
        </div>
      </div>

    </div>
  )
}