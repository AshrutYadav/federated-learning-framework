import React from "react"
import { Shield, ShieldAlert, ShieldX } from "lucide-react"

export default function TrustLeaderboard({ trustData }) {
  const clients = Object.entries(trustData || {})
    .map(([client, score]) => ({ client, score }))
    .sort((a, b) => b.score - a.score)

  if (clients.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
        <p className="text-slate-500 font-medium">No Clients Registered</p>
      </div>
    )
  }

  const getStatus = (score) => {
    if (score >= 80) return { label: "Trusted", icon: Shield, color: "text-green-400 bg-green-400/10 border-green-400/20" }
    if (score >= 50) return { label: "Warned", icon: ShieldAlert, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" }
    return { label: "Untrusted", icon: ShieldX, color: "text-red-400 bg-red-400/10 border-red-400/20" }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden shadow-lg shadow-black/20">
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="font-semibold text-slate-200">Client Trust Leaderboard</h3>
      </div>
      <div className="divide-y divide-slate-700/50 max-h-72 overflow-y-auto">
        {clients.map((c, idx) => {
          const status = getStatus(c.score)
          const Icon = status.icon
          return (
            <div key={c.client} className="flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors">
              <div className="flex items-center space-x-4">
                <span className="text-slate-500 font-mono text-sm w-4">{idx + 1}.</span>
                <div>
                  <p className="text-slate-200 font-medium">{c.client}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-slate-400">Score</span>
                  <span className="font-mono text-white">{c.score}</span>
                </div>
                <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border text-xs font-medium w-24 justify-center ${status.color}`}>
                  <Icon size={14} />
                  <span>{status.label}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
