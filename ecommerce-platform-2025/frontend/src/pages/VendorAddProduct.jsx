// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ninh Tuan Dat
// ID: s3975278
import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/vendor/ProductForm.jsx";
import { createProduct } from "../services/vendorProductService.js";

export default function VendorAddProduct() {
  const navigate = useNavigate();

  function handleSubmit(values) {
    createProduct(values);
    navigate("/vendor/products");
  }

  return (
    <section className="row justify-content-center">
      <div className="col-md-8">
        <h1 className="h3">Add New Product</h1>
        <ProductForm onSubmit={handleSubmit} submitText="Create Product" />
      </div>
    </section>
  );
}
