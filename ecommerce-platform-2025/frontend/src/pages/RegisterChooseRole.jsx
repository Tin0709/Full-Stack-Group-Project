import { Link } from "react-router-dom";
export default function RegisterChooseRole() {
  return (
    <section>
      <h1>Register – Choose Role</h1>
      <div className="row g-3 mt-2">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5>Customer</h5>
              <p>Buy products</p>
              <Link className="btn btn-primary" to="/register/customer">
                Continue
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5>Vendor</h5>
              <p>Sell products</p>
              <Link className="btn btn-primary" to="/register/vendor">
                Continue
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5>Shipper</h5>
              <p>Deliver orders</p>
              <Link className="btn btn-primary" to="/register/shipper">
                Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
