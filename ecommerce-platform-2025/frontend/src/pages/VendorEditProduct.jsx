
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/vendor/ProductForm.jsx";
import { getProduct, updateProduct } from "../services/vendorProductService.js";

export default function VendorEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProduct(id);

  if (!product) {
    return (
      <section>
        <h1 className="h3">Product Not Found</h1>
        <p>The requested product does not exist.</p>
      </section>
    );
  }

  function handleSubmit(values) {
    updateProduct(id, values);
    navigate("/vendor/products");
  }

  return (
    <section className="row justify-content-center">
      <div className="col-md-8">
        <h1 className="h3">Edit Product</h1>
        <ProductForm
          initial={product}
          onSubmit={handleSubmit}
          submitText="Save Changes"
        />
      </div>
    </section>
  );
}
