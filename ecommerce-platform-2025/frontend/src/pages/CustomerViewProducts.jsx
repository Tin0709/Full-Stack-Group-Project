export default function CustomerViewProducts() {
  return (
    <section>
      <h1>Products</h1>
      <div className="row g-3 mt-2">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Sample Product</h5>
              <p className="card-text">Price: $0.00</p>
              <a href="/products/1" className="btn btn-outline-primary me-2">
                View Details
              </a>
              <a href="/cart" className="btn btn-primary">
                Add to Cart
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
