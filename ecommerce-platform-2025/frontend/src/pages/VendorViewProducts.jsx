import { Link } from "react-router-dom";
export default function VendorViewProducts() {
  return (
    <section>
      <div className="d-flex justify-content-between align-items-center">
        <h1>My Products</h1>
        <Link className="btn btn-primary" to="/vendor/products/new">
          Add New Product
        </Link>
      </div>
      <p className="mt-3">
        Grid or table of vendor’s products with Edit/Delete actions.
      </p>
    </section>
  );
}
