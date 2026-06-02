import React from "react"
import { GitCommit, Download } from "lucide-react"

export default function ModelTimeline({ versions }) {
  if (!versions || versions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-violet-900/20 rounded-xl bg-[#1A1325]/50">
        <p className="text-indigo-400/50 font-medium">No Models Saved Yet</p>
      </div>
    )
  }

  const uniqueVersions = versions
    .filter((v, index, self) => index === self.findIndex(x => x.round === v.round && x.path === v.path))
    .sort((a, b) => b.round - a.round)

  return (
    <div className="bg-[#1A1325]/80 backdrop-blur-md border border-violet-900/20 rounded-xl p-4 shadow-lg shadow-black/40 h-full animate-fade-in-up flex flex-col">
      <h3 className="font-semibold text-violet-50 text-sm mb-4">Model Versions</h3>
      
      <div className="relative border-l border-violet-900/50 ml-2.5 space-y-3 flex-1 overflow-y-auto pr-2 pb-1">
        {uniqueVersions.map((v, idx) => (
          <div key={idx} className="relative pl-5">
            <div className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border ${idx === 0 ? 'bg-violet-500 border-[#0B0814] ring-2 ring-violet-500/50' : 'bg-indigo-900 border-[#1A1325]'}`}></div>
            
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-[13px] font-semibold text-indigo-100">Global Model v{v.round}</span>
                {idx === 0 && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-500/20 text-violet-400 uppercase tracking-wider">Latest</span>}
              </div>
            </div>
            
            <div className="bg-[#0B0814]/50 border border-violet-900/30 rounded-lg p-2.5 mt-1.5 flex items-center group hover:border-violet-500/30 hover:bg-violet-900/10 transition-colors">
              <div className="flex items-center space-x-2 text-indigo-400/70">
                <GitCommit size={14} />
                <span className="font-mono text-[11px] truncate">{v.path}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
