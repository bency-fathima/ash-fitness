import React, { useMemo } from "react";
import DonutChart from "./AdminChart";

const AdminRightSide = ({ admin, dashboardData }) => {
  const totals = useMemo(() => {
    const programs = dashboardData?.totalPrograms ?? admin?.program?.length ?? 0;
    const experts = dashboardData?.totalExperts ?? admin?.experts?.length ?? 0;
    const clients = dashboardData?.totalClients ?? 0;
    return { programs, experts, clients };
  }, [dashboardData, admin]);

  const totalEntities = totals.programs + totals.experts + totals.clients;
  const toPercent = (value) =>
    totalEntities > 0 ? Math.round((value / totalEntities) * 100) : 0;

  const programsPct = toPercent(totals.programs);
  const expertsPct = toPercent(totals.experts);
  const clientsPct = toPercent(totals.clients);

  const avgCompliance = useMemo(() => {
    const datasets = dashboardData?.graphData?.compliance?.datasets || [];
    const values = datasets.flatMap((ds) =>
      Array.isArray(ds?.data) ? ds.data : [],
    );
    const numeric = values.filter((v) => Number.isFinite(v));
    if (numeric.length === 0) return 0;
    const sum = numeric.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / numeric.length);
  }, [dashboardData]);

  const metrics = [
    { label: "Programs", value: `${programsPct}%`, color: "bg-[#9e5608]" },
    { label: "Experts", value: `${expertsPct}%`, color: "bg-[#EBF3F2]" },
    { label: "Clients", value: `${clientsPct}%`, color: "bg-[#F4DBC7]" },
  ];

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
              percentage={avgCompliance}
              high={programsPct}
              medium={expertsPct}
              low={clientsPct}
              size={180}
            />
          </div>

          {/* Legend Table */}
          <div className="w-full flex flex-col">
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-5"
              >
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

export default AdminRightSide;
