import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="text-center">
      <h1 className="display-5">404 – Not Found</h1>
      <p className="text-muted">Oops! This page doesn’t exist.</p>
      <Link className="btn btn-primary" to="/">
        Go Home
      </Link>
    </section>
  );
}
