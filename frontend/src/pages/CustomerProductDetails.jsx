import { useParams } from "react-router-dom";
export default function CustomerProductDetails() {
  const { id } = useParams();
  return (
    <section>
      <h1>Product Details #{id}</h1>
      <p>
        Image, name, price, description, quantity selector, Add to Cart button.
      </p>
    </section>
  );
}
