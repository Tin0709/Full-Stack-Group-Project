// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ninh Tuan Dat
// ID: s3975278
import { load, save, uid } from "./storage";
const KEY = "orders";
const defaultOrders = [
  { id: uid("ord"), date: new Date().toISOString(), customerName: "Nguyen Van A", customerEmail: "a@example.com", status: "Pending", items: [ {name:"Vietnamese Iced Coffee", price:35000, qty:2}, {name:"Green Tea", price:25000, qty:1} ], note: "Please deliver after 6pm" },
  { id: uid("ord"), date: new Date(Date.now()-86400000).toISOString(), customerName: "Tran Thi B", customerEmail: "b@example.com", status: "Completed", items: [ {name:"Banh mi", price:28000, qty:3} ], note: "" }
];
function computeTotals(order){ const subtotal = order.items.reduce((s,it)=>s+Number(it.price||0)*Number(it.qty||0),0); const discount = Number(order.discount||0); const shipping = Number(order.shipping||0); const total = Math.max(0, subtotal - discount + shipping); return {subtotal, discount, shipping, total};}
function seed(){ const cur = load(KEY, null); if(!cur){ const seeded = defaultOrders.map(o=>({...o, ...computeTotals(o)})); save(KEY, seeded);} } seed();
export function listOrders({status}={}){ let arr = load(KEY, []); if(status && status!=="All"){ arr = arr.filter(o=>o.status===status); } arr.sort((a,b)=> new Date(b.date)-new Date(a.date)); return arr; }
export function getOrder(id){ return listOrders().find(o=>o.id===id) || null; }
export function createOrder(data){ const arr = listOrders(); const order = { id: uid("ord"), date: new Date().toISOString(), status: "Pending", items: [], note: "", shipping:0, discount:0, ...data }; Object.assign(order, computeTotals(order)); arr.push(order); save(KEY, arr); return order; }
export function updateOrder(id, patch){ const arr = listOrders(); const idx = arr.findIndex(o=>o.id===id); if(idx===-1) return null; const updated = { ...arr[idx], ...patch }; Object.assign(updated, computeTotals(updated)); arr[idx]=updated; save(KEY, arr); return updated; }
export function deleteOrder(id){ const arr = listOrders().filter(o=>o.id!==id); save(KEY, arr); }
export const ORDER_STATUSES = ["Pending","Confirmed","Shipped","Completed","Cancelled"];
