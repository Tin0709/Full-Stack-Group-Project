// src/pages/Home.jsx

import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: "90vh" }}
    >
      <h1 className="mb-4 display-4 text-primary">
        Welcome to RMIT Marketplace
      </h1>
      <p className="lead mb-5">
        Your one-stop platform for vendors, customers, and shippers.
      </p>

      <div className="d-flex gap-3 flex-wrap justify-content-center">
        <Link to="/register/vendor" className="btn btn-outline-primary btn-lg">
          Register as Vendor
        </Link>
        <Link
          to="/register/customer"
          className="btn btn-outline-success btn-lg"
        >
          Register as Customer
        </Link>
        <Link to="/register/shipper" className="btn btn-outline-warning btn-lg">
          Register as Shipper
        </Link>
        <Link to="/login" className="btn btn-dark btn-lg">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;