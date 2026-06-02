import { useEffect, useState } from "react"
import { Activity, Users, FileDigit, ShieldAlert, CheckCircle, Database } from "lucide-react"
import api from "../services/api"

import MetricCard from "../components/MetricCard"
import AccuracyChart from "../components/AccuracyChart"
import TrustChart from "../components/TrustChart"
import TrustLeaderboard from "../components/TrustLeaderboard"
import SecurityEvents from "../components/SecurityEvents"
import ModelTimeline from "../components/ModelTimeline"
import ExperimentTable from "../components/ExperimentTable"

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [versions, setVersions] = useState([])
  const [blocked, setBlocked] = useState([])
  const [experiments, setExperiments] = useState([])
  const [trust, setTrust] = useState({})

  const load = () => {
    api.get("/metrics").then(r => setMetrics(r.data))
    api.get("/model_versions").then(r => setVersions(r.data.versions))
    api.get("/blocked_clients").then(r => setBlocked(r.data.blocked))
    api.get("/experiments").then(r => setExperiments(r.data.experiments))
    api.get("/trust").then(r => setTrust(r.data.scores))
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!metrics) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mb-4"></div>
          <p className="text-slate-400 font-medium">Connecting to Framework...</p>
        </div>
      </div>
    )
  }

  // Calculate some derived metrics
  const latestAccuracy = experiments.length > 0 ? experiments[experiments.length - 1].accuracy : 0
  const prevAccuracy = experiments.length > 1 ? experiments[experiments.length - 2].accuracy : 0
  const accuracyTrend = latestAccuracy > prevAccuracy ? "up" : latestAccuracy < prevAccuracy ? "down" : "flat"
  const accuracyDiff = Math.abs(latestAccuracy - prevAccuracy).toFixed(1)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 sm:p-10 font-sans selection:bg-sky-500/30">
      
      {/* HEADER */}
      <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Activity className="text-white" size={18} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Federated Monitoring</h1>
          </div>
          <p className="text-slate-400">Trust-Aware Distributed Training System</p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2 px-3 py-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">System Online</span>
          </div>
          <div className="w-px h-6 bg-slate-700"></div>
          <div className="flex items-center space-x-2 px-3 py-1">
            <Database size={14} className="text-sky-400" />
            <span className="text-xs font-medium text-slate-300">DB Connected</span>
          </div>
          <div className="w-px h-6 bg-slate-700"></div>
          <div className="flex items-center space-x-2 px-3 py-1">
            <Users size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-300">{metrics.total_clients} Clients</span>
          </div>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
        <MetricCard 
          title="Current Round" 
          value={metrics.current_round} 
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
          value={metrics.total_clients} 
          icon={Users}
          statusColor="default"
        />
        <MetricCard 
          title="Total Updates" 
          value={metrics.total_updates} 
          icon={FileDigit}
          statusColor="default"
        />
        <MetricCard 
          title="Average Trust" 
          value={Math.round(metrics.avg_trust)} 
          icon={ShieldAlert}
          statusColor={metrics.avg_trust > 80 ? "success" : "warning"}
        />
        <MetricCard 
          title="Blocked Clients" 
          value={metrics.blocked_clients} 
          icon={ShieldAlert}
          statusColor={metrics.blocked_clients > 0 ? "danger" : "default"}
        />
      </div>

      {/* MAIN ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-lg shadow-black/20">
          <h3 className="font-semibold text-slate-200 mb-6">Accuracy vs Round</h3>
          <AccuracyChart data={experiments} />
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-lg shadow-black/20">
          <h3 className="font-semibold text-slate-200 mb-6">Trust Score Distribution</h3>
          <TrustChart data={trust} />
        </div>
      </div>

      {/* ROW 2: LEADERBOARD & EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <TrustLeaderboard trustData={trust} />
        </div>
        <div className="lg:col-span-1">
          <SecurityEvents experiments={experiments} blockedClients={blocked} />
        </div>
      </div>

      {/* ROW 3: MODELS & EXPERIMENTS */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1">
          <ModelTimeline versions={versions} />
        </div>
        <div className="xl:col-span-3">
          <ExperimentTable experiments={experiments} />
        </div>
      </div>

    </div>
  )
}