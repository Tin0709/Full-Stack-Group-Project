
import React, { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import ChartCard from "./ChartCard";

export default function TopProductsBar({ orders, topN = 5 }) {
  const data = useMemo(() => {
    const qty = {};
    (orders || []).forEach(o => {
      (o.items || []).forEach(it => {
        const key = it.name || "Unknown";
        qty[key] = (qty[key] || 0) + Number(it.qty || 0);
      });
    });
    return Object.entries(qty)
      .map(([name, q]) => ({ name, qty: q }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, topN);
  }, [orders, topN]);

  return (
    <ChartCard title="Top products (by qty)">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="name" width={140} />
          <Tooltip />
          <Bar dataKey="qty" stroke="var(--bs-primary)" fill="var(--bs-primary)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
