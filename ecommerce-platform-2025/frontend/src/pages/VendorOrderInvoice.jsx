
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "../services/vendorOrderService";
import { getSettings } from "../services/vendorSettingsService";

export default function VendorOrderInvoice() {
  const { id } = useParams();
  const order = getOrder(id);
  const s = getSettings();

  useEffect(() => {
    // auto open print dialog
    setTimeout(() => window.print(), 300);
  }, []);

  if (!order) return <div className="container py-3"><div className="alert alert-danger">Order not found</div></div>;

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="mb-0">{s.storeName || "My Store"}</h3>
          <div className="text-muted small">{s.email} {s.phone ? `| ${s.phone}` : ""}</div>
          <div className="text-muted small">{s.address}</div>
        </div>
        {s.logo && <img src={s.logo} alt="logo" style={{ height: 60 }} />}
      </div>
      <hr />
      <div className="row">
        <div className="col-6">
          <h5>Invoice</h5>
          <div className="text-muted small">Order ID: {order.id}</div>
          <div className="text-muted small">Date: {new Date(order.date).toLocaleString()}</div>
        </div>
        <div className="col-6">
          <h5>Bill To</h5>
          <div>{order.customerName}</div>
          <div className="text-muted small">{order.customerEmail}</div>
        </div>
      </div>
      <div className="table-responsive my-3">
        <table className="table table-sm align-middle">
          <thead><tr><th>Item</th><th className="text-end">Price</th><th className="text-end">Qty</th><th className="text-end">Line</th></tr></thead>
          <tbody>
            {(order.items||[]).map((it, i) => (
              <tr key={i}>
                <td>{it.name}</td>
                <td className="text-end">{Number(it.price||0).toLocaleString("vi-VN")}</td>
                <td className="text-end">{it.qty}</td>
                <td className="text-end">{(Number(it.price||0)*Number(it.qty||0)).toLocaleString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan="3" className="text-end">Subtotal</td><td className="text-end">{(order.subtotal||0).toLocaleString("vi-VN")}</td></tr>
            <tr><td colSpan="3" className="text-end">Shipping</td><td className="text-end">{(order.shipping||0).toLocaleString("vi-VN")}</td></tr>
            <tr><td colSpan="3" className="text-end">Discount</td><td className="text-end">-{(order.discount||0).toLocaleString("vi-VN")}</td></tr>
            <tr className="fw-semibold"><td colSpan="3" className="text-end">Total</td><td className="text-end">{(order.total||0).toLocaleString("vi-VN")} VND</td></tr>
          </tfoot>
        </table>
      </div>
      <div className="text-center mb-5">
        <button className="btn btn-primary" onClick={() => window.print()}>Print</button>
      </div>
      <div className="text-center text-muted small">Thank you for your business!</div>
    </div>
  );
}
