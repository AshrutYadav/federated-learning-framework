import React from "react"
import { AlertTriangle, UserX, ShieldMinus, CheckCircle2 } from "lucide-react"

export default function SecurityEvents({ experiments, blockedClients }) {
  
  // Synthesize events from available data
  let events = []

  // Create events based on blocked clients
  if (blockedClients && blockedClients.length > 0) {
    blockedClients.forEach(client => {
      events.push({
        id: `block-${client}`,
        type: "blocked",
        title: "Client Blocked permanently",
        description: `Malicious update threshold reached for ${client}.`,
        severity: "danger",
        time: "Recent"
      })
    })
  }

  // Create events based on experiments
  if (experiments && experiments.length > 0) {
    // Sort experiments by round descending
    const recentExps = [...experiments].sort((a, b) => b.round - a.round).slice(0, 5)
    
    recentExps.forEach(exp => {
      if (exp.blocked > 0) {
        events.push({
          id: `anomaly-round-${exp.round}`,
          type: "anomaly",
          title: "Anomaly Detected",
          description: `${exp.blocked} updates rejected in Round ${exp.round} aggregation.`,
          severity: "warning",
          time: `Round ${exp.round}`
        })
      }
    })
  }

  // If no events, show a success state
  if (events.length === 0) {
    events.push({
      id: "all-clear",
      type: "clear",
      title: "System Secure",
      description: "No anomalies detected in recent rounds.",
      severity: "success",
      time: "Current"
    })
  }

  const getEventIcon = (severity) => {
    switch(severity) {
      case "danger": return <UserX size={18} className="text-red-400" />
      case "warning": return <AlertTriangle size={18} className="text-amber-400" />
      case "success": return <CheckCircle2 size={18} className="text-green-400" />
      default: return <ShieldMinus size={18} className="text-slate-400" />
    }
  }

  const getEventBg = (severity) => {
    switch(severity) {
      case "danger": return "bg-red-400/10 border-red-400/20"
      case "warning": return "bg-amber-400/10 border-amber-400/20"
      case "success": return "bg-green-400/10 border-green-400/20"
      default: return "bg-slate-700 border-slate-600"
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden shadow-lg shadow-black/20 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-200">Security Events</h3>
        <span className="flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${events[0]?.severity === 'danger' ? 'bg-red-400' : events[0]?.severity === 'warning' ? 'bg-amber-400' : 'bg-green-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${events[0]?.severity === 'danger' ? 'bg-red-500' : events[0]?.severity === 'warning' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
        </span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto max-h-72">
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex gap-4 items-start">
              <div className={`mt-0.5 p-2 rounded-full border ${getEventBg(event.severity)}`}>
                {getEventIcon(event.severity)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">{event.title}</p>
                  <span className="text-xs text-slate-500">{event.time}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
