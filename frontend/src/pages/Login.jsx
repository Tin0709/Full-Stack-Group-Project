export default function Login() {
  return (
    <section className="row justify-content-center">
      <div className="col-md-6">
        <h1>Login</h1>
        <form className="mt-3">
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input className="form-control" placeholder="Enter username" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
            />
          </div>
          <button className="btn btn-primary w-100">Login</button>
          <p className="mt-3 text-center">
            No account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </section>
  );
}
