import React, { useState } from "react"
import { Search, ChevronDown, ChevronUp } from "lucide-react"

export default function ExperimentTable({ experiments }) {
  const [sortField, setSortField] = useState("round")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")

  if (!experiments || experiments.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-violet-900/20 rounded-xl bg-[#1A1325]/50 w-full">
        <p className="text-indigo-400/50 font-medium mb-2">No Training Data Available</p>
        <p className="text-indigo-500/40 text-xs">Wait for the first aggregation round to complete.</p>
      </div>
    )
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredData = experiments.filter(exp => 
    exp.round.toString().includes(searchTerm) || 
    (exp.accuracy && exp.accuracy.toFixed(2).includes(searchTerm))
  )

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField] || 0
    const bValue = b[sortField] || 0
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-indigo-600 ml-1 opacity-0 group-hover:opacity-100" />
    return sortDirection === "asc" ? <ChevronUp size={12} className="text-violet-400 ml-1" /> : <ChevronDown size={12} className="text-violet-400 ml-1" />
  }

  return (
    <div className="bg-[#1A1325]/80 backdrop-blur-md border border-violet-900/20 rounded-xl overflow-hidden shadow-lg shadow-black/40 w-full animate-fade-in-up h-full flex flex-col">
      <div className="p-3 border-b border-violet-900/30 bg-[#1A1325] flex flex-col sm:flex-row justify-between items-center gap-3">
        <h3 className="font-semibold text-violet-50 text-sm">Experiment Log</h3>
        
        <div className="relative w-full sm:w-56">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search size={14} className="text-indigo-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-8 pr-3 py-1.5 border border-violet-900/30 rounded-lg bg-[#0B0814]/50 text-indigo-100 placeholder-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-xs transition-all"
            placeholder="Search rounds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0B0814]/40 text-indigo-400/70 text-[10px] uppercase tracking-wider border-b border-violet-900/20">
              <th className="px-4 py-3 cursor-pointer group hover:text-indigo-200 transition-colors" onClick={() => handleSort("round")}>
                <div className="flex items-center">Round <SortIcon field="round" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer group hover:text-indigo-200 transition-colors" onClick={() => handleSort("accuracy")}>
                <div className="flex items-center">Accuracy <SortIcon field="accuracy" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer group hover:text-indigo-200 transition-colors" onClick={() => handleSort("avg_trust")}>
                <div className="flex items-center">Avg Trust <SortIcon field="avg_trust" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer group hover:text-indigo-200 transition-colors" onClick={() => handleSort("blocked")}>
                <div className="flex items-center">Blocked <SortIcon field="blocked" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-violet-900/10 text-[13px]">
            {sortedData.map((exp, idx) => (
              <tr key={idx} className="hover:bg-violet-900/10 transition-colors">
                <td className="px-4 py-3 font-mono text-indigo-300">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-indigo-900/30 border border-indigo-500/20 mr-2 text-[11px]">
                    {exp.round}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="font-semibold text-violet-50 text-[13px]">{exp.accuracy?.toFixed(2)}%</span>
                    <div className="ml-2 w-12 h-1 bg-[#0B0814] rounded-full overflow-hidden">
                      <div className="h-full bg-violet-400" style={{ width: `${exp.accuracy}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium text-[11px] ${
                    exp.avg_trust >= 80 ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" :
                    exp.avg_trust >= 50 ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-rose-400/10 text-rose-400 border border-rose-400/20"
                  }`}>
                    {Math.round(exp.avg_trust)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {exp.blocked > 0 ? (
                    <span className="text-rose-400 flex items-center text-[12px] font-medium">
                      {exp.blocked} Clients
                    </span>
                  ) : (
                    <span className="text-indigo-500/50">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="p-6 text-center text-indigo-400/50 text-sm">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-violet-900/20 bg-[#1A1325] text-[11px] text-indigo-500/70 flex justify-between items-center mt-auto">
        <span>Showing {sortedData.length} records</span>
      </div>
    </div>
  )
}
