import { useParams } from "react-router-dom";
export default function ShipperOrderDetails() {
  const { id } = useParams();
  return (
    <section>
      <h1>Order Details #{id}</h1>
      <p>
        Products, receiver address, total. Buttons: Mark Delivered / Mark
        Canceled.
      </p>
      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-success">Mark Delivered</button>
        <button className="btn btn-danger">Mark Canceled</button>
      </div>
    </section>
  );
}
