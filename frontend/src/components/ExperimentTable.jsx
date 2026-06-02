import React, { useState } from "react"
import { Search, ChevronDown, ChevronUp } from "lucide-react"

export default function ExperimentTable({ experiments }) {
  const [sortField, setSortField] = useState("round")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")

  if (!experiments || experiments.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-800/20 w-full">
        <p className="text-slate-500 font-medium mb-2">No Training Data Available</p>
        <p className="text-slate-600 text-sm">Wait for the first aggregation round to complete.</p>
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
    if (sortField !== field) return <ChevronDown size={14} className="text-slate-600 ml-1 opacity-0 group-hover:opacity-100" />
    return sortDirection === "asc" ? <ChevronUp size={14} className="text-sky-400 ml-1" /> : <ChevronDown size={14} className="text-sky-400 ml-1" />
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden shadow-lg shadow-black/20 w-full">
      <div className="p-4 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="font-semibold text-slate-200">Experiment Log</h3>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg bg-slate-900/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-all"
            placeholder="Search rounds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/40 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
              <th className="px-6 py-4 cursor-pointer group hover:text-slate-200 transition-colors" onClick={() => handleSort("round")}>
                <div className="flex items-center">Round <SortIcon field="round" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer group hover:text-slate-200 transition-colors" onClick={() => handleSort("accuracy")}>
                <div className="flex items-center">Accuracy <SortIcon field="accuracy" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer group hover:text-slate-200 transition-colors" onClick={() => handleSort("avg_trust")}>
                <div className="flex items-center">Avg Trust <SortIcon field="avg_trust" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer group hover:text-slate-200 transition-colors" onClick={() => handleSort("blocked")}>
                <div className="flex items-center">Blocked <SortIcon field="blocked" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-sm">
            {sortedData.map((exp, idx) => (
              <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-300">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-slate-800 border border-slate-700 mr-2">
                    {exp.round}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-white">{exp.accuracy?.toFixed(2)}%</span>
                    <div className="ml-3 w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400" style={{ width: `${exp.accuracy}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${
                    exp.avg_trust >= 80 ? "bg-green-400/10 text-green-400" :
                    exp.avg_trust >= 50 ? "bg-amber-400/10 text-amber-400" : "bg-red-400/10 text-red-400"
                  }`}>
                    {Math.round(exp.avg_trust)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {exp.blocked > 0 ? (
                    <span className="text-red-400 flex items-center">
                      {exp.blocked} Clients
                    </span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500 flex justify-between items-center">
        <span>Showing {sortedData.length} records</span>
      </div>
    </div>
  )
}
