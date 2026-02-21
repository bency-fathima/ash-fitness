import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import LegendHeader from "./LegendHeader";

export default function ComplianceChart({ data }) {
  const hasData = data && Array.isArray(data) && data.length > 0;

  if (!hasData) {
    return (
      <div className="h-[220px] w-full flex flex-col">
        <LegendHeader />
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-xs text-gray-400 font-medium">
            No data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full">
      <LegendHeader />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          stackOffset="expand"
          barSize={32}
          margin={{ top: 0, right: 0, left: -27, bottom: 0 }}
        >
          <CartesianGrid horizontal={true} vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            dy={10}
          />
          <YAxis
            tickFormatter={(value) => `${Math.round(value * 100)}%`}
            domain={[0, 1]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 shadow-2xl rounded-2xl border border-gray-50 flex flex-col gap-1">
                    <p className="text-[11px] font-bold text-gray-800 mb-1">
                      {label}
                    </p>
                    {payload.map((entry, index) => (
                      <div
                        key={index}
                        className="flex justify-between gap-6 text-[11px] font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-gray-400 capitalize">
                            {entry.name}
                          </span>
                        </div>
                        <span className="text-gray-800">
                          {Math.round(entry.value)}%
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />

          <Bar
            dataKey="diet"
            stackId="a"
            fill="#EBF3F2"
            radius={[6, 6, 6, 6]}
          />
          <Bar
            dataKey="workout"
            stackId="a"
            fill="#F4DBC7"
            radius={[6, 6, 6, 6]}
            stroke="#ffffff"
            strokeWidth={3}
          />
          <Bar
            dataKey="therapy"
            stackId="a"
            fill="#9e5608"
            radius={[6, 6, 6, 6]}
            stroke="#ffffff"
            strokeWidth={3}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
