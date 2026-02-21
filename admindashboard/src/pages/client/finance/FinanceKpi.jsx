import { assets } from '@/assets/asset'
import KpiCard from '@/components/cards/KpiCard'
import React from 'react'

export default function FinanceKpi() {
  return (

    <div className=' bg-white p-5 rounded-xl mb-4 space-y-4'>
         <h2 className='text-[#9e5608] font-bold text-[16px]'>Salary & Incentives  Overview</h2>
 
    <div className='flex gap-4 justify-between  '>
       
        <KpiCard title="Total Experts" value="150" icon={assets.website}/>
        <KpiCard title="Total Monthly Salary" value="12,300,000" icon={assets.website}/>
        <KpiCard title="Total Incentives" value="1,200,300" icon={assets.chats}/>
        <KpiCard title="Average Expert Rating" value="$250,000" icon={assets.filter}/>

    </div>
       </div>
  )
}
