// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import { Routes, Route } from "react-router-dom";

// Layout
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import NavigationEffects from "./components/ui/NavigationEffects";

// Public pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Privacy from "./pages/Privacy.jsx";
import Help from "./pages/Help.jsx";

// Auth + account
import Login from "./pages/Login.jsx";
import RegisterChooseRole from "./pages/RegisterChooseRole.jsx";
import RegisterCustomer from "./pages/RegisterCustomer.jsx";
import RegisterVendor from "./pages/RegisterVendor.jsx";
import RegisterShipper from "./pages/RegisterShipper.jsx";
import MyAccount from "./pages/MyAccount.jsx";
import RoleLanding from "./pages/RoleLanding.jsx";

// Customer
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";

// Vendor
import VendorViewProducts from "./pages/VendorViewProducts.jsx";
import VendorAddProduct from "./pages/VendorAddProduct.jsx";
import VendorEditProduct from "./pages/VendorEditProduct.jsx";

// Shipper
import ShipperOrdersList from "./pages/ShipperOrdersList.jsx";
import ShipperOrderDetails from "./pages/ShipperOrderDetails.jsx";

// Fallback
import NotFound from "./pages/NotFound.jsx";

// Auth gate
import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-fill container py-3">
        <NavigationEffects>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/help" element={<Help />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Register */}
            <Route path="/register" element={<RegisterChooseRole />} />
            <Route path="/register/customer" element={<RegisterCustomer />} />
            <Route path="/register/vendor" element={<RegisterVendor />} />
            <Route path="/register/shipper" element={<RegisterShipper />} />

            {/* Shared (auth required) */}
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <MyAccount />
                </RequireAuth>
              }
            />
            <Route
              path="/role"
              element={
                <RequireAuth>
                  <RoleLanding />
                </RequireAuth>
              }
            />

            {/* Customer */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/order-confirmation"
              element={
                <RequireAuth roles={["customer"]}>
                  <OrderConfirmation />
                </RequireAuth>
              }
            />

            {/* Vendor */}
            <Route
              path="/vendor/products"
              element={
                <RequireAuth roles={["vendor"]}>
                  <VendorViewProducts />
                </RequireAuth>
              }
            />
            <Route
              path="/vendor/products/new"
              element={
                <RequireAuth roles={["vendor"]}>
                  <VendorAddProduct />
                </RequireAuth>
              }
            />
            <Route
              path="/vendor/products/:id/edit"
              element={
                <RequireAuth roles={["vendor"]}>
                  <VendorEditProduct />
                </RequireAuth>
              }
            />

            {/* Shipper */}
            <Route
              path="/shipper/orders"
              element={
                <RequireAuth roles={["shipper"]}>
                  <ShipperOrdersList />
                </RequireAuth>
              }
            />
            <Route
              path="/shipper/orders/:id"
              element={
                <RequireAuth roles={["shipper"]}>
                  <ShipperOrderDetails />
                </RequireAuth>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NavigationEffects>
      </main>

      <Footer />
    </div>
  );
}
