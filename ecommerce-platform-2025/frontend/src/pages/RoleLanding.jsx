import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function RoleLanding() {
  const user = useSelector((s) => s.user.user);

  if (!user) return null; // protected by RequireAuth

  return (
    <main className="container py-5">
      <h1 className="mb-4">Welcome, {user.username}</h1>
      {user.role === "customer" && (
        <div className="row g-3">
          <div className="col-md-6">
            <Link className="btn btn-primary w-100 p-3" to="/products">
              Browse Products
            </Link>
          </div>
          <div className="col-md-6">
            <Link className="btn btn-outline-secondary w-100 p-3" to="/cart">
              View Cart
            </Link>
          </div>
        </div>
      )}
      {user.role === "vendor" && (
        <div className="row g-3">
          <div className="col-md-6">
            <Link className="btn btn-primary w-100 p-3" to="/vendor/products">
              View My Products
            </Link>
          </div>
          <div className="col-md-6">
            <Link
              className="btn btn-outline-secondary w-100 p-3"
              to="/vendor/products/new"
            >
              Add New Product
            </Link>
          </div>
        </div>
      )}
      {user.role === "shipper" && (
        <div className="row g-3">
          <div className="col-md-6">
            <Link className="btn btn-primary w-100 p-3" to="/shipper/orders">
              Orders List
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
