// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ninh Tuan Dat
// ID: s3975278
import React, { useState } from "react";
import { getSettings, updateSettings } from "../services/vendorSettingsService";
import ImageDropzone from "../components/vendor/ImageDropzone";
export default function VendorSettings(){
  const [s, setS] = useState(getSettings());
  function save(){ setS(updateSettings(s)); alert("Saved!"); }
  return (
    <div className="container py-3">
      <h2 className="mb-3">Store Settings</h2>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card"><div className="card-body">
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label">Store Name</label><input className="form-control" value={s.storeName} onChange={e=>setS({ ...s, storeName:e.target.value })} /></div>
              <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" value={s.email} onChange={e=>setS({ ...s, email:e.target.value })} /></div>
              <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" value={s.phone} onChange={e=>setS({ ...s, phone:e.target.value })} /></div>
              <div className="col-md-6"><label className="form-label">Address</label><input className="form-control" value={s.address} onChange={e=>setS({ ...s, address:e.target.value })} /></div>
            </div>
            <button className="btn btn-primary mt-3" onClick={save}>Save</button>
          </div></div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100"><div className="card-body">
            <h5 className="card-title">Logo</h5>
            <ImageDropzone value={s.logo} onChange={(b64)=>setS({ ...s, logo: b64 })} />
            {s.logo && <button className="btn btn-sm btn-outline-secondary mt-2" onClick={()=>setS({ ...s, logo: "" })}>Remove</button>}
          </div></div>
        </div>
      </div>
    </div>
  );
}
