
import React from "react";
import MetricCard from "../components/vendor/MetricCard";
import { listOrders } from "../services/vendorOrderService";
import { listProducts } from "../services/vendorProductService";
import { listCategories } from "../services/vendorCategoryService";
export default function VendorDashboard(){
  const orders = listOrders();
  const products = listProducts();
  const categories = listCategories();
  const pending = orders.filter(o=>o.status==="Pending").length;
  const completed = orders.filter(o=>o.status==="Completed").length;
  const revenue = orders.filter(o=>o.status==="Completed").reduce((s,o)=> s + (o.total||0), 0);
  const lowStock = products.filter(p=> Number(p.stock||0) <= 5).length;
  return (
    <div className="container py-3">
      <h2 className="mb-3">Vendor Dashboard</h2>
      <div className="row g-3">
        <div className="col-md-3"><MetricCard title="Products" value={products.length} subtext={`${categories.length} categories`} /></div>
        <div className="col-md-3"><MetricCard title="Pending Orders" value={pending} subtext="Awaiting action" /></div>
        <div className="col-md-3"><MetricCard title="Completed Orders" value={completed} subtext="Last 30 days (demo)" /></div>
        <div className="col-md-3"><MetricCard title="Revenue" value={revenue.toLocaleString("vi-VN")} subtext="VND" /></div>
      </div>
      <div className="mt-4">
        <div className="alert alert-info">This dashboard uses <strong>localStorage</strong>. Swap the services to your API later without changing the UI.</div>
      </div>
    </div>
  );
}
