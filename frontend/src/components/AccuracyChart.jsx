import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-1">Round {label}</p>
        <p className="text-sky-400 font-bold">
          Accuracy: {payload[0].value.toFixed(2)}%
        </p>
      </div>
    )
  }
  return null
}

export default function AccuracyChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
        <p className="text-slate-500 font-medium">No Training Data Available</p>
      </div>
    )
  }

  // Ensure data is sorted by round
  const sortedData = [...data].sort((a, b) => a.round - b.round)

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="round" 
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#38BDF8" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#0F172A', stroke: '#38BDF8', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#38BDF8', stroke: '#0F172A', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
