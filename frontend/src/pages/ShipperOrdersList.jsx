import { Link } from "react-router-dom";
export default function ShipperOrdersList() {
  return (
    <section>
      <h1>Active Orders (My Hub)</h1>
      <div className="list-group mt-3">
        <Link
          className="list-group-item list-group-item-action"
          to="/shipper/orders/1"
        >
          Order #1 – Customer A – Total $123.45
        </Link>
      </div>
    </section>
  );
}
