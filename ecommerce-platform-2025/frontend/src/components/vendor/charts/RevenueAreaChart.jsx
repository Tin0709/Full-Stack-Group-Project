
import React, { useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import ChartCard from "./ChartCard";

function fmtDay(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

export default function RevenueAreaChart({ orders, days = 14 }) {
  const data = useMemo(() => {
    const today = new Date();
    const map = new Map();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, 0);
    }
    (orders || []).forEach(o => {
      if (o.status !== "Completed") return;
      const key = new Date(o.date).toISOString().slice(0, 10);
      if (map.has(key)) map.set(key, (map.get(key) || 0) + (o.total || 0));
    });
    return Array.from(map.entries()).map(([date, revenue]) => ({
      date: fmtDay(date),
      revenue,
    }));
  }, [orders, days]);

  return (
    <ChartCard title="Revenue (last 14 days)" subtitle="Completed orders only">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--bs-primary)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--bs-primary)" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(v)=> v.toLocaleString('vi-VN')} />
          <Area type="monotone" dataKey="revenue" stroke="var(--bs-primary)" fill="url(#revColor)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
