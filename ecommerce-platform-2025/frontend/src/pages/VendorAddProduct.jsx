export default function VendorAddProduct() {
  return (
    <section className="row justify-content-center">
      <div className="col-md-8">
        <h1>Add New Product</h1>
        <form className="mt-3">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" min="0" className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input type="file" className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea rows="4" className="form-control"></textarea>
          </div>
          <button className="btn btn-primary">Save</button>
        </form>
      </div>
    </section>
  );
}
