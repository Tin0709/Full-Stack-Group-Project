
import React, { useState } from "react";
import CSVImport from "../components/vendor/CSVImport";
import { createProduct } from "../services/vendorProductService";
import { Link } from "react-router-dom";
export default function VendorBulkImport(){
  const [rows, setRows] = useState([]);
  const [imported, setImported] = useState(0);
  function doImport(){
    let count = 0;
    rows.forEach(r=>{
      const p = { name: r.name || "", price: Number(r.price||0), description: r.description || "", stock: Number(r.stock||0), category: r.category || "", image: r.image || "" };
      if(p.name){ createProduct(p); count++; }
    });
    setImported(count);
  }
  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Bulk Import Products</h2>
        <Link to="/vendor/products" className="btn btn-outline-secondary">Back to Products</Link>
      </div>
      <div className="card"><div className="card-body">
        <CSVImport onRows={setRows} />
        <button className="btn btn-primary mt-3" disabled={rows.length===0} onClick={doImport}>Import {rows.length} rows</button>
        {imported>0 && <div className="alert alert-success mt-3">Imported {imported} products. <Link to="/vendor/products">View products</Link></div>}
      </div></div>
    </div>
  );
}
