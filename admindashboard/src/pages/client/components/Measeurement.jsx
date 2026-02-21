import React, { useEffect, useState } from "react";
import { assets } from "@/assets/asset";
import { useDispatch } from "react-redux";
import { fetchClientMeasurementHistory } from "@/redux/features/client/client.thunk";

export default function Measeurement() {
const dispatch = useDispatch();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    dispatch(fetchClientMeasurementHistory())
      .unwrap()
      .then((data) => {
        setHistory(data.measurementHistory || []);
      })
      .catch(console.error);
  }, [dispatch]);

  if (!history.length) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm mt-4 text-gray-400 text-sm">
        No measurement data available
      </div>
    );
  }

  const start = history[0];
  const current = history[history.length - 1];

  const measurements = [
    {
      label: "Chest",
      before: `${start.chest} cm`,
      current: `${current.chest} cm`,
      color: "bg-[#9e5608]",
    },
    {
      label: "Waist",
      before: `${start.waist} cm`,
      current: `${current.waist} cm`,
      color: "bg-[#F4DBC7]",
    },
    {
      label: "Hips",
      before: `${start.hip} cm`,
      current: `${current.hip} cm`,
      color: "bg-[#EBF3F2]",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm mt-4">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[#9e5608] font-bold text-sm">Measurements</h3>
        <img
          src={assets.threeDotVector}
          alt="more"
          className="w-4 h-4 cursor-pointer"
        />
      </div>
      <div className="space-y-6">
        {measurements.map((m, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-1.5 h-10 rounded-full ${m.color}`}></div>
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[14px] font-bold text-gray-800">
                {m.label}
              </span>
              <div className="flex gap-4 items-center">
                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                  Before{" "}
                  <span className="font-bold text-gray-800">{m.before}</span>
                </span>
                <span
                  className={`text-[12px] font-bold px-3 py-1 rounded-lg ${
                    m.active
                      ? "bg-[#9e5608] text-white shadow-sm"
                      : "text-[#9e5608] border border-emerald-100 bg-emerald-50/30"
                  }`}
                >
                  {m.current}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
