import React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1325] border border-fuchsia-900/30 p-3 rounded-lg shadow-xl shadow-black/40">
        <p className="text-indigo-200 font-medium mb-1">Round {label}</p>
        <p className="text-rose-400 font-bold">
          Blocked Clients: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export default function SecurityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-fuchsia-900/20 rounded-xl bg-[#1A1325]/50">
        <p className="text-indigo-400/50 font-medium">No Security Data Available</p>
      </div>
    )
  }

  const sortedData = [...data].sort((a, b) => a.round - b.round)

  return (
    <div className="h-72 w-full animate-fade-in-up">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb7185" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D1F3F" vertical={false} />
          <XAxis 
            dataKey="round" 
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
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4c1d95', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area 
            type="stepAfter" 
            dataKey="blocked" 
            stroke="#fb7185" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBlocked)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
