import React from 'react'

export default function TherapyHeader() {
  return (
       <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#66706D] uppercase tracking-wider">
              Therapy Name
            </label>
            <span className="text-sm font-bold text-[#9e5608]">
            Therapy Beginner
            </span>
          </div>
          <hr className="border-gray-50" />
         
        </div>
  )
}
