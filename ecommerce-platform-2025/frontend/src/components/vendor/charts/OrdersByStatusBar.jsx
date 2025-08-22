
import React, { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import ChartCard from "./ChartCard";

export default function OrdersByStatusBar({ orders }) {
  const data = useMemo(() => {
    const counts = {};
    (orders || []).forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [orders]);

  return (
    <ChartCard title="Orders by status">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" stroke="var(--bs-info)" fill="var(--bs-info)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
