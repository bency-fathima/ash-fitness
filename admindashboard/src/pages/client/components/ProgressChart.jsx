import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchClientWeightHistory } from "@/redux/features/client/client.thunk";
  
export default function ProgressChart() {
  const dispatch = useDispatch();

  const customTicks = [0, 30, 60, 90, 120];

 const [weight, setWeight] = useState([]);

useEffect(() => {
  dispatch(fetchClientWeightHistory())
    .unwrap()
    .then((data) => {
      setWeight(data.weightHistory);
    })
    .catch((err) => {
      console.error("Failed to load weight history", err);
    });
}, [dispatch]);
const startWeight = weight.length > 0 ? weight[0].weight : 0;
const currentWeight =
  weight.length > 0 ? weight[weight.length - 1].weight : 0;
const weightChange = currentWeight - startWeight;

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weight} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid horizontal={true} vertical={false} stroke="#F1F5F9" />

          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            dy={10}
          />
          <YAxis
            domain={[0, 120]}
            ticks={customTicks}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            tickFormatter={(v) => `${v} kg`}
          />

          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-4 shadow-2xl rounded-2xl border border-gray-50 flex flex-col gap-1.5">
                    <div className="flex justify-between gap-8 text-[11px] font-bold">
                       <span className="text-gray-400">Current</span>
                       <span className="text-gray-800">{currentWeight}</span>
                    </div>
                    <div className="flex justify-between gap-8 text-[11px] font-bold">
                       <span className="text-gray-400">Start</span>
                       <span className="text-gray-800">{startWeight}</span>
                    </div>
                    <div className="flex justify-between gap-8 text-[11px] font-bold">
                       <span className="text-gray-400">Change</span>
                       <span className="text-[#9e5608]">{weightChange}</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#9e5608"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: '#9e5608', stroke: '#fff', strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
