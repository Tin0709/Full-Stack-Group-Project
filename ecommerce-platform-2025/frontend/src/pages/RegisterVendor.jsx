export default function RegisterVendor() {
  return (
    <section className="row justify-content-center">
      <div className="col-md-8">
        <h1>Register – Vendor</h1>
        <form className="mt-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Username</label>
              <input className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Business Name</label>
              <input className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Business Address</label>
              <input className="form-control" />
            </div>
            <div className="col-12">
              <label className="form-label">Profile Picture</label>
              <input type="file" className="form-control" />
            </div>
          </div>
          <button className="btn btn-primary mt-3">Create Account</button>
        </form>
      </div>
    </section>
  );
}
