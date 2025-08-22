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
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails.jsx";

import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";

import CustomerOrderConfirmation from "./pages/CustomerOrderConfirmation.jsx";

// Vendor
import VendorViewProducts from "./pages/VendorViewProducts.jsx";
import VendorAddProduct from "./pages/VendorAddProduct.jsx";
import VendorEditProduct from "./pages/VendorEditProduct.jsx";

import VendorDashboard from "./pages/VendorDashboard";
import VendorOrders from "./pages/VendorOrders";
import VendorOrderDetail from "./pages/VendorOrderDetail";
import VendorCategories from "./pages/VendorCategories";
import VendorCoupons from "./pages/VendorCoupons";
import VendorSettings from "./pages/VendorSettings";
import VendorBulkImport from "./pages/VendorBulkImport";

import VendorInventory from "./pages/VendorInventory";
import VendorOrderInvoice from "./pages/VendorOrderInvoice";

// Shipper
import ShipperOrdersList from "./pages/ShipperOrdersList.jsx";
import ShipperOrderDetails from "./pages/ShipperOrderDetails.jsx";

// Fallback
import NotFound from "./pages/NotFound.jsx";

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

            {/* Register flows */}
            <Route path="/register" element={<RegisterChooseRole />} />
            <Route path="/register/customer" element={<RegisterCustomer />} />
            <Route path="/register/vendor" element={<RegisterVendor />} />
            <Route path="/register/shipper" element={<RegisterShipper />} />

            {/* Shared */}
            <Route path="/account" element={<MyAccount />} />
            <Route path="/role" element={<RoleLanding />} />

            {/* Customer */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

            <Route
              path="/customer/confirm"
              element={<CustomerOrderConfirmation />}
            />

            {/* Vendor */}
            <Route path="/vendor/products" element={<VendorViewProducts />} />
            <Route path="/vendor/add" element={<VendorAddProduct />} />

            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
            <Route path="/vendor/orders/:id" element={<VendorOrderDetail />} />

            <Route path="/vendor/categories" element={<VendorCategories />} />
            <Route path="/vendor/coupons" element={<VendorCoupons />} />
            <Route path="/vendor/settings" element={<VendorSettings />} />

            <Route path="/vendor/products" element={<VendorViewProducts />} />
            <Route path="/vendor/add" element={<VendorAddProduct />} />
            <Route path="/vendor/products/:id/edit" element={<VendorEditProduct />} />
            <Route path="/vendor/products/import" element={<VendorBulkImport />} />

            <Route path="/vendor/inventory" element={<VendorInventory />} />
            <Route path="/vendor/orders/:id/invoice" element={<VendorOrderInvoice />} />

            {/* Shipper */}
            <Route path="/shipper/orders" element={<ShipperOrdersList />} />
            <Route
              path="/shipper/orders/:id"
              element={<ShipperOrderDetails />}
            />

            <Route path="/vendor/products/:id/edit" element={<VendorEditProduct />} />

            /* 404 */
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NavigationEffects>
      </main>

      <Footer />
    </div>
  );
}
