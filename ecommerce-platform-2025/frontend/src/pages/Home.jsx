export default function Home() {
  return (
    <section>
      <h1 className="mb-3">Welcome to MultiRole Shop</h1>
      <p className="text-muted">
        Customers shop, Vendors sell, Shippers deliver.
      </p>
      <div className="d-flex gap-2 mt-3">
        <a className="btn btn-primary" href="/products">
          Shop Now
        </a>
        <a className="btn btn-outline-secondary" href="/register">
          Get Started
        </a>
      </div>
    </section>
  );
}
