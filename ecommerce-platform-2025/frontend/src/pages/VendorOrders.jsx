// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ninh Tuan Dat
// ID: s3975278
import React, { useMemo, useState } from "react";
import { listOrders, ORDER_STATUSES, deleteOrder } from "../services/vendorOrderService";
import { Link } from "react-router-dom";
import ConfirmButton from "../components/vendor/ConfirmButton";
function formatDate(s){ return new Date(s).toLocaleString(); }
export default function VendorOrders(){
  const [status, setStatus] = useState("All");
  const [q, setQ] = useState("");
  const orders = useMemo(()=> listOrders({ status }), [status]);
  const filtered = useMemo(()=>{
    const term = q.trim().toLowerCase();
    if(!term) return orders;
    return orders.filter(o =>
      o.customerName.toLowerCase().includes(term) ||
      o.customerEmail.toLowerCase().includes(term) ||
      o.id.toLowerCase().includes(term)
    );
  }, [orders, q]);
  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Orders</h2>
      </div>
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <select className="form-select" value={status} onChange={e=>setStatus(e.target.value)}>
            <option>All</option>
            {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-5">
          <input className="form-control" placeholder="Search by ID / customer" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Status</th><th className="text-end">Total (VND)</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td><Link to={`/vendor/orders/${o.id}`}>{o.id}</Link></td>
                <td>{formatDate(o.date)}</td>
                <td><div className="fw-semibold">{o.customerName}</div><div className="text-muted small">{o.customerEmail}</div></td>
                <td><span className="badge bg-secondary">{o.status}</span></td>
                <td className="text-end">{(o.total||0).toLocaleString("vi-VN")}</td>
                <td className="text-end">
                  <ConfirmButton onConfirm={()=>{ deleteOrder(o.id); window.location.reload(); }}>Delete</ConfirmButton>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No orders</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
