
import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import ChartCard from "./ChartCard";

export default function CategoryDistributionPie({ products }) {
  const data = useMemo(() => {
    const counts = {};
    (products || []).forEach(p => {
      const key = (p.category || "Uncategorized").trim() || "Uncategorized";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = [
    "var(--bs-primary)",
    "var(--bs-success)",
    "var(--bs-warning)",
    "var(--bs-danger)",
    "var(--bs-info)",
    "var(--bs-secondary)",
  ];

  return (
    <ChartCard title="Products by category">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
