import BaseTable from '@/components/table/BaseTable'
import React from 'react'
import { FinanceColumns } from './FinanceColumns'
import { financeData } from './financeData'
import KpiCard from '@/components/cards/KpiCard'
import FinanceKpi from './FinanceKpi'

export default function FinanceTable() {
  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <FinanceKpi />
      <BaseTable
        columns={FinanceColumns}
        data={financeData}
        pageLabel={"Finance List"}
      />
    </div>
  );
}
