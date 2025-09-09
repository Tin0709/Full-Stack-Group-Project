// src/pages/Home.jsx
// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Nguyen Trung Tin
// ID: s3988418

import React from "react";
import { Link } from "react-router-dom";
import "./styles/Home.css";

// Reusable UI
import {
  SectionHeader,
  ProductCard,
  StepCard,
  HorizontalScroller,
} from "../components/ui";

const heroBg =
  "https://wallup.net/wp-content/uploads/2017/11/17/372622-city-Chicago.jpg";

// Featured list (used by horizontal scroller)
const featured = [
  {
    title: "Smart Blender",
    subtitle: "Blend smoothies effortlessly",
    img: "https://cdn.thewirecutter.com/wp-content/media/2023/07/blender-2048px-0453.jpg?auto=webp&quality=75&width=1024",
  },
  {
    title: "Cozy Sofa Set",
    subtitle: "Relax in style",
    img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Summer Dress Collection",
    subtitle: "Stay trendy this season",
    img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Wireless Headphones",
    subtitle: "Immerse in sound",
    img: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Gaming Chair",
    subtitle: "Ergonomic comfort",
    img: "https://cybeart.com/cdn/shop/products/Arancio_3.jpg?v=1752182975&width=1090",
  },
  {
    title: "Espresso Machine",
    subtitle: "Barista at home",
    img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Running Shoes",
    subtitle: "Lightweight & durable",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Smartwatch",
    subtitle: "Track your health",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200&auto=format&fit=crop",
  },
];

// “How it works” cards
const steps = {
  customers: [
    {
      title: "Browse",
      desc: "Explore a vast catalog of products.",
      img: "https://media.istockphoto.com/id/1053519140/vector/search-result-optimization-seo-marketing-analytics-flat-vector-banner-with-icons-seo.jpg?s=612x612&w=0&k=20&c=lgOhOUZINAAwIlC8GgTSKKT-6O-s4Oa19WLffawDDgY=",
    },
    {
      title: "Shop",
      desc: "Add items to your cart and checkout securely.",
      img: "https://static.vecteezy.com/system/resources/previews/059/449/045/non_2x/retail-shopping-and-e-commerce-business-strategy-flat-illustration-vector.jpg",
    },
    {
      title: "Receive",
      desc: "Get your orders delivered quickly and reliably.",
      img: "https://img.freepik.com/free-vector/courier-delivering-order-customer-door-man-getting-parcel-box-package-flat-vector-illustration-postman-shipping-service_74855-8309.jpg?semt=ais_hybrid&w=740&q=80",
    },
  ],
  vendors: [
    {
      title: "List",
      desc: "Easily add your products to our marketplace.",
      img: "https://assets.designtemplate.io/images/Vector%20Illustration%20of%20Woman%20Reviewing%20Business%20Charts-HD.webp",
    },
    {
      title: "Manage",
      desc: "Handle orders and inventory efficiently.",
      img: "https://assets.designtemplate.io/images/Man%20Teaching%20Performance%20Management%20Principles%202D%20Vector%20Illustration-HD.webp",
    },
    {
      title: "Track",
      desc: "Monitor your sales and performance.",
      img: "https://assets.designtemplate.io/images/Woman%20Reviewing%20and%20Presenting%20Performance%20Metrics%20Vector%20Illustration-HD.webp",
    },
  ],
  shippers: [
    {
      title: "Pick Up",
      desc: "Accept delivery requests and pick up packages.",
      img: "https://static.vecteezy.com/system/resources/previews/032/471/618/non_2x/truck-shipping-flat-vector.jpg",
    },
    {
      title: "Deliver",
      desc: "Deliver packages to customers on time.",
      img: "https://img.freepik.com/free-vector/courier-delivered-boxes-businessman_74855-6333.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      title: "Complete",
      desc: "Confirm deliveries and get paid.",
      img: "https://img.freepik.com/premium-vector/online-parcel-delivery-service-concept-online-service-fast-delivery-parcel-your-home-happy-courier-handing-box-with-order-from-truck-stopwatch-flat-vector-illustration_608021-1532.jpg",
    },
  ],
};

export default function Home() {
  return (
    <main className="Home">
      <div className="home-wrapper">
        {/* HERO */}
        <section
          className="hero position-relative text-center text-white d-flex align-items-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="hero__overlay" />
          <div className="container position-relative py-5">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-9">
                <h1 className="display-5 fw-black mb-2">
                  Your One‑Stop Shop for Everything
                </h1>
                <p className="lead mb-4">
                  Discover a wide range of products from trusted vendors,
                  delivered right to your doorstep.
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <Link to="/products" className="btn btn-danger btn-lg px-4">
                    Shop Now
                  </Link>
                  <Link
                    to="/vendor/products/new"
                    className="btn btn-light btn-lg px-4"
                  >
                    Sell with Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED (Horizontal scroller) */}
        <section className="py-5">
          <div className="container">
            <SectionHeader title="Featured Products" />
            <HorizontalScroller>
              {featured.map((p) => (
                <div key={p.title} className="home-card">
                  <ProductCard {...p} />
                </div>
              ))}
            </HorizontalScroller>
          </div>
        </section>

        {/* HOW IT WORKS — CUSTOMERS */}
        <section className="py-5">
          <div className="container">
            <SectionHeader
              title="For Customers"
              subtitle="Browse, shop, and enjoy fast delivery."
            />
            <div className="row g-3">
              {steps.customers.map((s) => (
                <StepCard key={s.title} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — VENDORS */}
        <section className="py-5">
          <div className="container">
            <SectionHeader
              title="For Vendors"
              subtitle="List your products and reach a wider audience."
            />
            <div className="row g-3">
              {steps.vendors.map((s) => (
                <StepCard key={s.title} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — SHIPPERS */}
        <section className="py-5">
          <div className="container">
            <SectionHeader
              title="For Shippers"
              subtitle="Deliver packages and earn with flexible schedules."
            />
            <div className="row g-3">
              {steps.shippers.map((s) => (
                <StepCard key={s.title} {...s} />
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-5 bg-light">
          <div className="container text-center">
            <h2 className="h3 fw-bold mb-2">Join Genz Today</h2>
            <p className="mb-4">
              Whether you're a customer, vendor, or shipper, Genz has something
              for you.
            </p>
            <Link to="/register" className="btn btn-danger btn-lg px-5">
              Get Started
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
