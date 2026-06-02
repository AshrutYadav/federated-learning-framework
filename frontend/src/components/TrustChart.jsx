import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1325] border border-violet-900/30 p-3 rounded-lg shadow-xl shadow-black/40">
        <p className="text-indigo-200 font-medium mb-1">{label}</p>
        <p className="text-violet-50 font-bold">
          Trust Score: <span className={payload[0].value < 50 ? "text-rose-400" : payload[0].value < 80 ? "text-amber-400" : "text-emerald-400"}>{payload[0].value}</span>
        </p>
      </div>
    )
  }
  return null
}

export default function TrustChart({ data }) {
  const chartData = Object.entries(data || {}).map(([client, score]) => ({
    name: client,
    score: score
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-violet-900/20 rounded-xl bg-[#1A1325]/50">
        <p className="text-indigo-400/50 font-medium">No Clients Connected</p>
      </div>
    )
  }

  return (
    <div className="h-72 w-full animate-fade-in-up">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D1F3F" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#6366f1" 
            tick={{ fill: '#818cf8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6366f1" 
            tick={{ fill: '#818cf8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2D1F3F', opacity: 0.4 }} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.score < 50 ? '#fb7185' : entry.score < 80 ? '#fbbf24' : '#34d399'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
