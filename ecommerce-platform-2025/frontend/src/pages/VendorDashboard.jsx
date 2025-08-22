
import React from "react";
import MetricCard from "../components/vendor/MetricCard";
import { listOrders } from "../services/vendorOrderService";
import { listProducts } from "../services/vendorProductService";
import { listCategories } from "../services/vendorCategoryService";

import RevenueAreaChart from "../components/vendor/charts/RevenueAreaChart";
import OrdersByStatusBar from "../components/vendor/charts/OrdersByStatusBar";
import CategoryDistributionPie from "../components/vendor/charts/CategoryDistributionPie";
import TopProductsBar from "../components/vendor/charts/TopProductsBar";
import LowStockBanner from "../components/vendor/LowStockBanner";

export default function VendorDashboard() {
  const orders = listOrders();
  const products = listProducts();
  const categories = listCategories();

  const pending = orders.filter(o => o.status === "Pending").length;
  const completed = orders.filter(o => o.status === "Completed").length;
  const revenue = orders.filter(o => o.status === "Completed").reduce((s,o)=> s + (o.total || 0), 0);

  return (
    <div className="container py-3">
      <h2 className="mb-3">Vendor Dashboard</h2>

      <div className="row g-3">
        <div className="col-md-3">
          <MetricCard title="Products" value={products.length} subtext={`${categories.length} categories`} />
        </div>
        <div className="col-md-3">
          <MetricCard title="Pending Orders" value={pending} subtext="Awaiting action" />
        </div>
        <div className="col-md-3">
          <MetricCard title="Completed Orders" value={completed} subtext="Last 30 days (demo)" />
        </div>
        <div className="col-md-3">
          <MetricCard title="Revenue" value={revenue.toLocaleString("vi-VN")} subtext="VND" />
        </div>
      </div>
      
      <LowStockBanner products={products} threshold={5} />
      
      <div className="row g-3 mt-1">
        <div className="col-xl-6 col-lg-12">
          <RevenueAreaChart orders={orders} />
        </div>
        <div className="col-xl-6 col-lg-12">
          <OrdersByStatusBar orders={orders} />
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-xl-6 col-lg-12">
          <CategoryDistributionPie products={products} />
        </div>
        <div className="col-xl-6 col-lg-12">
          <TopProductsBar orders={orders} />
        </div>
      </div>
      <LowStockBanner products={products} threshold={5} />
    </div>
  );
}
