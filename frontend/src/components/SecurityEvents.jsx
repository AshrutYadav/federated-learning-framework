import React from "react"
import { AlertTriangle, UserX, ShieldMinus, CheckCircle2 } from "lucide-react"

export default function SecurityEvents({ experiments, blockedClients }) {
  
  let events = []

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

  if (experiments && experiments.length > 0) {
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
      case "danger": return <UserX size={16} className="text-rose-400" />
      case "warning": return <AlertTriangle size={16} className="text-amber-400" />
      case "success": return <CheckCircle2 size={16} className="text-emerald-400" />
      default: return <ShieldMinus size={16} className="text-indigo-400" />
    }
  }

  const getEventBg = (severity) => {
    switch(severity) {
      case "danger": return "bg-rose-400/10 border-rose-400/20"
      case "warning": return "bg-amber-400/10 border-amber-400/20"
      case "success": return "bg-emerald-400/10 border-emerald-400/20"
      default: return "bg-indigo-900/30 border-indigo-500/20"
    }
  }

  return (
    <div className="bg-[#1A1325]/80 backdrop-blur-md border border-violet-900/20 rounded-xl overflow-hidden shadow-lg shadow-black/40 flex flex-col h-full animate-fade-in-up">
      <div className="p-3 border-b border-violet-900/30 bg-[#1A1325] flex justify-between items-center">
        <h3 className="font-semibold text-violet-50 text-sm">Security Events</h3>
        <span className="flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75 ${events[0]?.severity === 'danger' ? 'bg-rose-400' : events[0]?.severity === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${events[0]?.severity === 'danger' ? 'bg-rose-500' : events[0]?.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
        </span>
      </div>
      <div className="p-3 flex-1 overflow-y-auto max-h-72">
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex gap-3 items-start">
              <div className={`mt-0.5 p-1.5 rounded-full border ${getEventBg(event.severity)}`}>
                {getEventIcon(event.severity)}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-indigo-100">{event.title}</p>
                  <span className="text-[10px] text-indigo-400/70">{event.time}</span>
                </div>
                <p className="text-[11px] text-indigo-300/80 leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
