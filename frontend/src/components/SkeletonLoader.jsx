import React from "react"

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#0B0814] p-6 sm:p-10 w-full animate-pulse">
      <div className="mb-8 flex flex-col lg:flex-row justify-between gap-6">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-[#1A1325] rounded-lg"></div>
          <div className="h-4 w-48 bg-[#1A1325] rounded-md"></div>
        </div>
        <div className="h-10 w-full lg:w-96 bg-[#1A1325] rounded-xl"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-[#1A1325] rounded-xl border border-fuchsia-900/10"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="h-72 bg-[#1A1325] rounded-xl border border-fuchsia-900/10"></div>
        <div className="h-72 bg-[#1A1325] rounded-xl border border-fuchsia-900/10"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 h-72 bg-[#1A1325] rounded-xl border border-fuchsia-900/10"></div>
        <div className="lg:col-span-1 h-72 bg-[#1A1325] rounded-xl border border-fuchsia-900/10"></div>
      </div>
    </div>
  )
}
