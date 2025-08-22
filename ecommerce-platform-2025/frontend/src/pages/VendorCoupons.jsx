
import React, { useState } from "react";
import { listCoupons, createCoupon, updateCoupon, deleteCoupon } from "../services/vendorCouponService";
import ConfirmButton from "../components/vendor/ConfirmButton";
export default function VendorCoupons(){
  const [items, setItems] = useState(listCoupons());
  const [form, setForm] = useState({ code:"", discountType:"percent", amount:0, minOrder:0, startDate:"", endDate:"", active:true });
  function refresh(){ setItems(listCoupons()); }
  function add(){ if(!form.code.trim()) return; createCoupon(form); setForm({ code:"", discountType:"percent", amount:0, minOrder:0, startDate:"", endDate:"", active:true }); refresh(); }
  function onField(id, field, value){ updateCoupon(id, { [field]: value }); refresh(); }
  return (
    <div className="container py-3">
      <h2 className="mb-3">Coupons</h2>
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3"><input className="form-control" placeholder="CODE" value={form.code} onChange={e=>setForm({ ...form, code:e.target.value })} /></div>
            <div className="col-md-2">
              <select className="form-select" value={form.discountType} onChange={e=>setForm({ ...form, discountType:e.target.value })}>
                <option value="percent">Percent %</option>
                <option value="fixed">Fixed VND</option>
              </select>
            </div>
            <div className="col-md-2"><input type="number" className="form-control" placeholder="Amount" value={form.amount} onChange={e=>setForm({ ...form, amount:e.target.value })} /></div>
            <div className="col-md-2"><input type="number" className="form-control" placeholder="Min order (VND)" value={form.minOrder} onChange={e=>setForm({ ...form, minOrder:e.target.value })} /></div>
            <div className="col-md-1 d-grid"><button className="btn btn-primary" onClick={add}>Add</button></div>
          </div>
          <div className="row g-2 mt-2">
            <div className="col-md-2"><input type="date" className="form-control" value={form.startDate} onChange={e=>setForm({ ...form, startDate:e.target.value })} /></div>
            <div className="col-md-2"><input type="date" className="form-control" value={form.endDate} onChange={e=>setForm({ ...form, endDate:e.target.value })} /></div>
            <div className="col-md-2 d-flex align-items-center">
              <input id="active" type="checkbox" className="form-check-input me-2" checked={form.active} onChange={e=>setForm({ ...form, active:e.target.checked })} />
              <label htmlFor="active" className="form-check-label">Active</label>
            </div>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>Code</th><th>Type</th><th>Amount</th><th>Min</th><th>Start</th><th>End</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {items.map(c=>(
              <tr key={c.id}>
                <td><input className="form-control form-control-sm" defaultValue={c.code} onBlur={e=>onField(c.id, "code", e.target.value)} /></td>
                <td>
                  <select className="form-select form-select-sm" defaultValue={c.discountType} onChange={e=>onField(c.id, "discountType", e.target.value)}>
                    <option value="percent">Percent</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </td>
                <td><input type="number" className="form-control form-control-sm" defaultValue={c.amount} onBlur={e=>onField(c.id, "amount", Number(e.target.value))} /></td>
                <td><input type="number" className="form-control form-control-sm" defaultValue={c.minOrder} onBlur={e=>onField(c.id, "minOrder", Number(e.target.value))} /></td>
                <td><input type="date" className="form-control form-control-sm" defaultValue={c.startDate} onBlur={e=>onField(c.id, "startDate", e.target.value)} /></td>
                <td><input type="date" className="form-control form-control-sm" defaultValue={c.endDate} onBlur={e=>onField(c.id, "endDate", e.target.value)} /></td>
                <td><input type="checkbox" className="form-check-input" defaultChecked={c.active} onChange={e=>onField(c.id, "active", e.target.checked)} /></td>
                <td className="text-end"><ConfirmButton onConfirm={()=>{ deleteCoupon(c.id); setItems(listCoupons()); }} /></td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan="8" className="text-center text-muted">No coupons</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
