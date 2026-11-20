"use client";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface DayPoint {
  key: string;
  label: string;
  xp: number;
  minutes: number;
  isToday?: boolean;
}

function TooltipBox({ active, payload }: { active?: boolean; payload?: { payload: DayPoint }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border-2 border-line-strong bg-white px-3 py-2 text-sm shadow-soft">
      <p className="font-bold">{p.label}</p>
      <p className="tnum">{p.xp} XP · {p.minutes} phút</p>
    </div>
  );
}

export function ActivityChart({ data, goal, height = 220 }: { data: DayPoint[]; goal: number; height?: number }) {
  const max = Math.max(goal, ...data.map((d) => d.xp));
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#EFE3D8" strokeDasharray="4 4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6E6773", fontSize: 12, fontWeight: 600 }} />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} domain={[0, Math.ceil(max / 10) * 10]} tick={{ fill: "#6E6773", fontSize: 12 }} />
          <Tooltip cursor={{ fill: "rgba(255,145,77,.08)" }} content={<TooltipBox />} />
          <Bar dataKey="xp" radius={[10, 10, 4, 4]} maxBarSize={40}>
            {data.map((d) => (
              <Cell key={d.key} fill={d.xp >= goal ? "#B52B38" : d.isToday ? "#FF914D" : "#FFD0B0"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
