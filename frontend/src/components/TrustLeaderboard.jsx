import React from "react"
import { Shield, ShieldAlert, ShieldX } from "lucide-react"

export default function TrustLeaderboard({ trustData }) {
  const clients = Object.entries(trustData || {})
    .map(([client, score]) => ({ client, score }))
    .sort((a, b) => b.score - a.score)

  if (clients.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-fuchsia-900/20 rounded-xl bg-[#1A1325]/50">
        <p className="text-indigo-400/50 font-medium">No Clients Registered</p>
      </div>
    )
  }

  const getStatus = (score) => {
    if (score >= 80) return { label: "Trusted", icon: Shield, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" }
    if (score >= 50) return { label: "Warned", icon: ShieldAlert, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" }
    return { label: "Untrusted", icon: ShieldX, color: "text-rose-400 bg-rose-400/10 border-rose-400/20" }
  }

  return (
    <div className="bg-[#1A1325]/80 backdrop-blur-md border border-fuchsia-900/20 rounded-xl overflow-hidden shadow-lg shadow-black/40 animate-fade-in-up flex flex-col h-full">
      <div className="p-3 border-b border-fuchsia-900/30 bg-[#1A1325]">
        <h3 className="font-semibold text-fuchsia-50 text-sm">Client Trust Leaderboard</h3>
      </div>
      <div className="divide-y divide-fuchsia-900/20 flex-1 overflow-y-auto max-h-72">
        {clients.map((c, idx) => {
          const status = getStatus(c.score)
          const Icon = status.icon
          return (
            <div key={c.client} className="flex items-center justify-between p-3 hover:bg-fuchsia-900/10 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-indigo-500 font-mono text-xs w-4">{idx + 1}.</span>
                <div>
                  <p className="text-indigo-100 font-medium text-sm">{c.client}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-indigo-400/70 uppercase">Score</span>
                  <span className="font-mono text-fuchsia-100 text-sm">{c.score}</span>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[10px] font-medium w-20 justify-center ${status.color}`}>
                  <Icon size={12} />
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
