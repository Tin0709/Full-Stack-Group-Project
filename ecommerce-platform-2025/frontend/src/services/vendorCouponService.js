// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ninh Tuan Dat
// ID: s3975278
import { load, save, uid } from "./storage";
const KEY = "coupons";
function seed(){ const cur = load(KEY, null); if(!cur){ save(KEY, [ { id: uid("cpn"), code:"WELCOME10", discountType:"percent", amount:10, minOrder:50000, active:true, startDate: new Date(Date.now()-86400000*7).toISOString().slice(0,10), endDate: new Date(Date.now()+86400000*90).toISOString().slice(0,10) } ]); } } seed();
export function listCoupons(){ return load(KEY, []); }
export function getCoupon(id){ return listCoupons().find(c=>c.id===id) || null; }
export function createCoupon(data){ const arr = listCoupons(); const c = { id: uid("cpn"), code:"", discountType:"percent", amount:0, minOrder:0, active:true, ...data }; arr.push(c); save(KEY, arr); return c; }
export function updateCoupon(id, patch){ const arr = listCoupons(); const idx = arr.findIndex(c=>c.id===id); if(idx===-1) return null; arr[idx] = { ...arr[idx], ...patch }; save(KEY, arr); return arr[idx]; }
export function deleteCoupon(id){ const arr = listCoupons().filter(c=>c.id!==id); save(KEY, arr); return true; }
export function applyCoupon(code, amount){ const today = new Date().toISOString().slice(0,10); const c = listCoupons().find(c=>c.code.toLowerCase()===String(code||"").toLowerCase()); if(!c || !c.active) return {valid:false, message:"Invalid coupon"}; if(c.startDate && today < c.startDate) return {valid:false, message:"Coupon not started"}; if(c.endDate && today > c.endDate) return {valid:false, message:"Coupon expired"}; if(amount < (c.minOrder||0)) return {valid:false, message:`Minimum order ${c.minOrder} VND`}; let discount=0; if(c.discountType==="percent") discount = Math.round(amount * (Number(c.amount||0)/100)); else discount = Math.round(Number(c.amount||0)); return { valid:true, discount, coupon:c }; }
