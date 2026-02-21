import React, { useMemo } from "react";
import { MoreHorizontal, FileText } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpertRightSide = ({ expert }) => {
  const complianceStats = useMemo(() => {
    const users = expert?.assignedUsers || [];
    if (users.length === 0) {
      return {
        totalClients: 0,
        avgCompliance: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
      };
    }

    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let totalCompliance = 0;

    users.forEach((user) => {
      const compliance = Number(user?.compliance ?? 0);
      totalCompliance += compliance;

      if (compliance > 75) {
        highCount += 1;
      } else if (compliance >= 40) {
        mediumCount += 1;
      } else {
        lowCount += 1;
      }
    });

    const avgCompliance = Math.round(totalCompliance / users.length);

    return {
      totalClients: users.length,
      avgCompliance,
      highCount,
      mediumCount,
      lowCount,
    };
  }, [expert?.assignedUsers]);

  const complianceData = useMemo(() => {
    if (complianceStats.totalClients === 0) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#E5E7EB"],
            borderWidth: 0,
            cutout: "80%",
            borderRadius: 4,
            spacing: 2,
          },
        ],
      };
    }

    return {
      labels: ["High", "Medium", "Low"],
      datasets: [
        {
          data: [
            complianceStats.highCount,
            complianceStats.mediumCount,
            complianceStats.lowCount,
          ],
          backgroundColor: ["#9e5608", "#EBF3F2", "#F4DBC7"],
          borderWidth: 0,
          cutout: "80%",
          borderRadius: 4,
          spacing: 2,
        },
      ],
    };
  }, [complianceStats]);

  const getPercent = (count) => {
    if (!complianceStats.totalClients) return "0%";
    return `${Math.round((count / complianceStats.totalClients) * 100)}%`;
  };

  const complianceOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const documents = [
    {
      name: "Employment_Contract_CliffVilliam_T1003.pdf",
      size: "2.4 MB",
    },
    {
      name: "Certification_EnglishTeaching_Cambridge_T1003.pdf",
      size: "1.8 MB",
    },
    {
      name: "ID_Passport_CliffVilliam_T1003.pdf",
      size: "2.2 MB",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6  pb-4 sm:pb-6">
      {/* Response Time Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-bold text-[#9e5608]">Response Time</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-[#F8F9FA] rounded-xl">
            <span className="text-[11px] sm:text-xs text-[#66706D] font-medium">
              Average Response Time
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#011412] tracking-tight">
              {expert?.responseTime || "1h 12m"}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#F8F9FA] rounded-xl">
            <span className="text-[11px] sm:text-xs text-[#66706D] font-medium">
              Fast Responses
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#66706D] pr-2 border-r border-gray-200">
                {expert?.responseTime || "1h 12m"}
              </span>
              <span className="text-xs font-bold text-[#9e5608]">94%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Compliance Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-bold text-[#9e5608]">
            Client Compliance
          </h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="relative h-40 sm:h-44 mb-6 sm:mb-8">
          <Doughnut data={complianceData} options={complianceOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-[#66706D] font-medium">
              {complianceStats.totalClients === 0
                ? "No Data"
                : "Avg Compliance"}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#011412]">
              {complianceStats.totalClients === 0
                ? "--"
                : `${complianceStats.avgCompliance}%`}
            </span>
            <span className="text-[10px] text-[#66706D] font-medium mt-1">
              {complianceStats.totalClients === 0
                ? "0 clients"
                : `${complianceStats.totalClients} clients`}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              label: "High",
              count: complianceStats.highCount,
              percent: getPercent(complianceStats.highCount),
              color: "bg-[#9e5608]",
            },
            {
              label: "Medium",
              count: complianceStats.mediumCount,
              percent: getPercent(complianceStats.mediumCount),
              color: "bg-[#EBF3F2]",
            },
            {
              label: "Low",
              count: complianceStats.lowCount,
              percent: getPercent(complianceStats.lowCount),
              color: "bg-[#F4DBC7]",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl relative overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.color}`}
              ></div>
              <span className="text-xs font-bold text-[#011412] ml-1">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#66706D] font-medium pr-2 border-r border-gray-200">
                  {item.count} clients
                </span>
                <span className="text-xs font-bold text-[#011412]">
                  {item.percent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm flex-1">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-bold text-[#9e5608]">Documents</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {(expert?.certifications
            ? [{ name: expert.certifications, size: "2.4 MB" }]
            : documents
          ).map((doc, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 bg-[#FAF3E0] rounded-lg text-[#DAA520] shrink-0">
                <FileText size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold text-[#011412] truncate">
                  {doc.name}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-[#66706D]">
                  <span className="uppercase">PDF</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertRightSide;
