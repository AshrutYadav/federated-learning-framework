import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        <p className="text-white font-bold">
          Trust Score: <span className={payload[0].value < 50 ? "text-red-400" : payload[0].value < 80 ? "text-amber-400" : "text-green-400"}>{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

export default function TrustChart({ data }) {
  // data comes as an object { client_1: 100, client_2: 90 }
  const chartData = Object.entries(data || {}).map(([client, score]) => ({
    name: client,
    score: score
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
        <p className="text-slate-500 font-medium">No Clients Connected</p>
      </div>
    )
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E293B' }} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.score < 50 ? '#EF4444' : entry.score < 80 ? '#F59E0B' : '#22C55E'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
