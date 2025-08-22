
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { getOrder, updateOrder, ORDER_STATUSES } from "../services/vendorOrderService";
function formatDate(s){ return new Date(s).toLocaleString(); }
export default function VendorOrderDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [order, setOrder] = useState(()=> getOrder(id));
  const [status, setStatus] = useState(order?.status || "Pending");
  const [note, setNote] = useState(order?.note || "");
  const totals = useMemo(()=> (order ? { subtotal: order.subtotal, shipping: order.shipping, discount: order.discount, total: order.total } : {}), [order]);
  if(!order){ return <div className="container py-3"><div className="alert alert-danger">Order not found</div></div>; }
  function save(){ const upd = updateOrder(order.id, { status, note }); setOrder(upd); }
  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Order {order.id}</h2>
        <button className="btn btn-outline-secondary" onClick={()=>nav(-1)}>Back</button>
      </div>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Items</h5>
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead><tr><th>Item</th><th className="text-end">Price</th><th className="text-end">Qty</th><th className="text-end">Line</th></tr></thead>
                  <tbody>
                    {order.items.map((it, idx)=>(
                      <tr key={idx}>
                        <td>{it.name}</td>
                        <td className="text-end">{Number(it.price||0).toLocaleString("vi-VN")}</td>
                        <td className="text-end">{it.qty}</td>
                        <td className="text-end">{(Number(it.price||0)*Number(it.qty||0)).toLocaleString("vi-VN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Summary</h5>
              <div className="d-flex justify-content-between"><span>Subtotal</span><span>{(totals.subtotal||0).toLocaleString("vi-VN")} VND</span></div>
              <div className="d-flex justify-content-between"><span>Shipping</span><span>{(totals.shipping||0).toLocaleString("vi-VN")} VND</span></div>
              <div className="d-flex justify-content-between"><span>Discount</span><span>-{(totals.discount||0).toLocaleString("vi-VN")} VND</span></div>
              <hr/>
              <div className="d-flex justify-content-between fw-semibold"><span>Total</span><span>{(totals.total||0).toLocaleString("vi-VN")} VND</span></div>
              <div className="mt-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={status} onChange={e=>setStatus(e.target.value)}>
                  {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="mt-2">
                <label className="form-label">Note</label>
                <textarea className="form-control" rows="3" value={note} onChange={e=>setNote(e.target.value)} />
              </div>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-primary" onClick={save}>Save</button>
                <Link to={`/vendor/orders/${order.id}/invoice`} className="btn btn-outline-primary">
                  Print Invoice
                </Link>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">Customer</h5>
              <div className="mb-1">{order.customerName}</div>
              <div className="text-muted small">{order.customerEmail}</div>
              <div className="text-muted small">Placed: {formatDate(order.date)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
