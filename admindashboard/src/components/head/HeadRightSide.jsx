import React, { useMemo } from "react";
import DonutChart from "./AdminChart";

const HeadRightSide = ({ Head, dashboardData }) => {
  // Performance data rendering logic based on dashboardData
  const performanceInfo = useMemo(() => {
    const adminPerf = dashboardData?.adminPerformance || {
      programs: 0,
      experts: 0,
      clients: 0,
    };

    const total = adminPerf.programs + adminPerf.experts + adminPerf.clients;

    const toPercent = (val) =>
      total > 0 ? Math.round((val / total) * 100) : 0;

    const programsPct = toPercent(adminPerf.programs);
    const expertsPct = toPercent(adminPerf.experts);
    const clientsPct = toPercent(adminPerf.clients);

    // Use expertPerformance.taskCompletion as the center average compliance score
    const avgCompliance = dashboardData?.expertPerformance?.taskCompletion || 0;

    return {
      programs: programsPct,
      experts: expertsPct,
      clients: clientsPct,
      average: avgCompliance,
      metrics: [
        { label: "Programs", value: `${programsPct}%`, color: "bg-[#9e5608]" },
        { label: "Experts", value: `${expertsPct}%`, color: "bg-[#EBF3F2]" },
        { label: "Clients", value: `${clientsPct}%`, color: "bg-[#F4DBC7]" },
      ],
    };
  }, [dashboardData]);

  return (
    <div className=" flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-6 flex flex-col shadow-sm ">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[#9e5608] font-bold text-lg">Performance</h2>
        </div>

        {/* Chart Section */}
        <div className="flex flex-col items-center gap-0">
          <div className="">
            <DonutChart
              percentage={performanceInfo.average}
              high={performanceInfo.programs}
              medium={performanceInfo.experts}
              low={performanceInfo.clients}
              size={180}
            />
          </div>

          {/* Legend Table */}
          <div className="w-full flex flex-col">
            {performanceInfo.metrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between py-5">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-sm ${metric.color}`}></div>
                  <span className="text-[#66706D] text-sm font-medium">
                    {metric.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadRightSide;
