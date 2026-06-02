import React from "react"
import { GitCommit, Download } from "lucide-react"

export default function ModelTimeline({ versions }) {
  if (!versions || versions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
        <p className="text-slate-500 font-medium">No Models Saved Yet</p>
      </div>
    )
  }

  // Deduplicate and sort descending
  const uniqueVersions = versions
    .filter((v, index, self) => index === self.findIndex(x => x.round === v.round && x.path === v.path))
    .sort((a, b) => b.round - a.round)

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-lg shadow-black/20 h-full">
      <h3 className="font-semibold text-slate-200 mb-6">Model Version History</h3>
      
      <div className="relative border-l-2 border-slate-700 ml-3 space-y-8">
        {uniqueVersions.map((v, idx) => (
          <div key={idx} className="relative pl-6">
            <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 ${idx === 0 ? 'bg-sky-500 border-slate-900 ring-2 ring-sky-500/50' : 'bg-slate-700 border-slate-800'}`}></div>
            
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-slate-200">Global Model v{v.round}</span>
                {idx === 0 && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 uppercase tracking-wider">Latest</span>}
              </div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 mt-2 flex justify-between items-center group hover:border-slate-600 transition-colors">
              <div className="flex items-center space-x-3 text-sm text-slate-400">
                <GitCommit size={16} />
                <span className="font-mono text-xs truncate max-w-[200px] sm:max-w-xs">{v.path}</span>
              </div>
              <button className="text-slate-500 hover:text-sky-400 transition-colors opacity-0 group-hover:opacity-100">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
