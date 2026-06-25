"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", lessons: 2 },
  { day: "Tue", lessons: 4 },
  { day: "Wed", lessons: 3 },
  { day: "Thu", lessons: 6 },
  { day: "Fri", lessons: 5 },
  { day: "Sat", lessons: 7 },
  { day: "Sun", lessons: 4 },
];

export default function YourChartComponent() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="lessons"
            stroke="#8b5cf6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}