import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RegisterVendor from "./pages/RegisterVendor";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterShipper from "./pages/RegisterShipper";
import Login from "./pages/Login";
import MyAccount from "./pages/MyAccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/vendor" element={<RegisterVendor />} />
        <Route path="/register/customer" element={<RegisterCustomer />} />
        <Route path="/register/shipper" element={<RegisterShipper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route
          path="*"
          element={
            <div className="container mt-5">
              <h2>404 - Page Not Found</h2>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;