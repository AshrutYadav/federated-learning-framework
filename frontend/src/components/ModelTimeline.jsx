import React from "react"
import { GitCommit, Download } from "lucide-react"

export default function ModelTimeline({ versions }) {
  if (!versions || versions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-fuchsia-900/20 rounded-xl bg-[#1A1325]/50">
        <p className="text-indigo-400/50 font-medium">No Models Saved Yet</p>
      </div>
    )
  }

  const uniqueVersions = versions
    .filter((v, index, self) => index === self.findIndex(x => x.round === v.round && x.path === v.path))
    .sort((a, b) => b.round - a.round)

  return (
    <div className="bg-[#1A1325]/80 backdrop-blur-md border border-fuchsia-900/20 rounded-xl p-4 shadow-lg shadow-black/40 h-full animate-fade-in-up">
      <h3 className="font-semibold text-fuchsia-50 text-sm mb-4">Model Versions</h3>
      
      <div className="relative border-l border-fuchsia-900/50 ml-2.5 space-y-6">
        {uniqueVersions.map((v, idx) => (
          <div key={idx} className="relative pl-5">
            <div className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border ${idx === 0 ? 'bg-fuchsia-500 border-[#0B0814] ring-2 ring-fuchsia-500/50' : 'bg-indigo-900 border-[#1A1325]'}`}></div>
            
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-[13px] font-semibold text-indigo-100">Global Model v{v.round}</span>
                {idx === 0 && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-fuchsia-500/20 text-fuchsia-400 uppercase tracking-wider">Latest</span>}
              </div>
            </div>
            
            <div className="bg-[#0B0814]/50 border border-fuchsia-900/30 rounded-lg p-2.5 mt-1.5 flex justify-between items-center group hover:border-fuchsia-500/30 hover:bg-fuchsia-900/10 transition-colors">
              <div className="flex items-center space-x-2 text-indigo-400/70">
                <GitCommit size={14} />
                <span className="font-mono text-[11px] truncate max-w-[120px] sm:max-w-[150px]">{v.path}</span>
              </div>
              <button className="text-indigo-500 hover:text-fuchsia-400 transition-colors opacity-0 group-hover:opacity-100">
                <Download size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
