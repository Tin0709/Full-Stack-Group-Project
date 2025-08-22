// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ninh Tuan Dat
// ID: s3975278
import React, { useState } from "react";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../services/vendorCategoryService";
import ConfirmButton from "../components/vendor/ConfirmButton";
export default function VendorCategories(){
  const [items, setItems] = useState(listCategories());
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  function refresh(){ setItems(listCategories()); }
  function add(){ if(!name.trim()) return; createCategory({ name: name.trim(), description: desc }); setName(""); setDesc(""); refresh(); }
  function rename(id, newName){ updateCategory(id, { name: newName }); refresh(); }
  function redesc(id, newDesc){ updateCategory(id, { description: newDesc }); refresh(); }
  return (
    <div className="container py-3">
      <h2 className="mb-3">Categories</h2>
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4"><input className="form-control" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} /></div>
            <div className="col-md-2 d-grid"><button className="btn btn-primary" onClick={add}>Add</button></div>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>Name</th><th>Description</th><th style={{width:120}}></th></tr></thead>
          <tbody>
            {items.map(c=>(
              <tr key={c.id}>
                <td><input className="form-control form-control-sm" defaultValue={c.name} onBlur={e=>rename(c.id, e.target.value)} /></td>
                <td><input className="form-control form-control-sm" defaultValue={c.description} onBlur={e=>redesc(c.id, e.target.value)} /></td>
                <td className="text-end"><ConfirmButton onConfirm={()=>{ deleteCategory(c.id); refresh(); }} /></td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan="3" className="text-center text-muted">No categories</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
