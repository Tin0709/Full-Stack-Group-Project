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
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCTFo8XZpiRheymN5_ZfFuH4kOdoRr_P9Zp-fsAD59zeFTfthoQ8jd4deWyxUeVAcDQTJVI6ITdy4Tz_-TD-HFhGd-Twj_bUNvujR0l7ccgkR10mdVrmG0_DCDelzlj4_d77V2aC-pql-3lTsfmBfipQOMrpu52r2_Tsj9N1P4J8_f1GqYa-0PiAH294dgOsDTTkz6ad-KnnjdtuqMMHoymPt7NXjcudroaF_6VMWeOgmHxiLU_5v7B1dsMdK2Hi8icwH7zVLipdRQ";

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
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmJIvlVD8R1O3fxffxR9eaqnCfDRU2szymTS_sGUacUhgiAexi2DrU3f0ldl77B2JZj1ZnJtzVIppIKTxOznW97QFmDRoaBMQamCGPGNcChKiWRBvGu7gNweGaUK8g1U8LAHIf6uAAzQMGEYnQp3Kmqckjjxf1GMPkCJUt6N9fQAiIxSzDXKTRxixQ8lm3vxPJvPXeIOIWS3P5Eff6Hkeel2YiFT10GHslpfOUVYlV0dkJarniSAFseKxkVCLii204GEA-A7Ag4Lw",
    },
    {
      title: "Shop",
      desc: "Add items to your cart and checkout securely.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGDdcow8NEbtMXIM62bADlnnzgbuOZdRBcKkRUTNmskQDZ-RXvKmRi2uE8scgjniq4WQkW152KlD32oo46zCFUxgtVW7f-ec2sJaUwlKOPRAF3ADpTgEfLogqPbneyyJAb2kw5FGipmqef2DuN2DD2TSnyMCrW9g04l753UM5myiZonUXwqMzsiwEeVkk3FUO-x8lnkiCFP07JppQ9mkRvtTuzsJHPsl5CnKwTGIMcO4c-lEhwZ6regJ2astjMLJy-A-RXs4NGxcM",
    },
    {
      title: "Receive",
      desc: "Get your orders delivered quickly and reliably.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG3qXdRKBRL3DeA3yuLFCSHFKlJDjPw8bg0FmefeDDcT_yX-oJCg_HnfJ54kX-T54tc40y-h-WvsRme-LkumRlrfPFmS-Mzosl5Q94pWuvYpOHVDORUBVqyQQiM8OWTas9VxKTd6ZQMtXQo6ro_HajIGaEsB1owVrCssEk4rUjuR96JsdtUROJ700dIk_6dheIdHvTR9OG5j-zply0mDVs6BTooHJmygvooRPGjGqxkiW6HnDXmyj_w_EAD_tz660Ts4yf0SRsmjg",
    },
  ],
  vendors: [
    {
      title: "List",
      desc: "Easily add your products to our marketplace.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8Jc1exNZ09cxsEgjGRY0bHvMGcQ2LJxpKdJl4aUArvdrc7OvQpxitDmWnoiAJ7vx0LVodoaLdazWGNwSvLaoYaRe_hkiwvt3AkPTQAlKurJaN28YSRQdjivtQ_USwg7ek0VL-V8tP34gGgkngsNoUNmMMkyUxVVYAFChl_spRV2GFSEe_lu3mmA1N744Z15QGw0M6bVcm2gkSTA9mw28vmXLP2g7iyB9VaEPD2fyn0g6DBcNGthMaciRgbnPoQvR09bHsCHxF8VY",
    },
    {
      title: "Manage",
      desc: "Handle orders and inventory efficiently.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc7GpqrbhbEkMNTX87gCRPLazSpR3KKDp-Fnm_SiNBUHv-JVfPHHId-KZXgA_LRxjUenEGsRP4IAj0dFIMQufDO-tHgmVyDFJ0hkYmm2TP8-sgN3Y3g6rL9_wz2yVEPOaJd2y-LoBWZXa_Lw5x-GXilzRkRfhNBRkLwuyXYzK7J9YlrnbHhue7gQXvWruDxYC8_QcgWoCcP1Jj6GI_6EmRQnpwU4w6blKTGgmd7KZlHJw1B8TQeX_BmMu5H0AKu-P3Hztq-tMTOHI",
    },
    {
      title: "Track",
      desc: "Monitor your sales and performance.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1fMxjlm7xx47BbTyvjtdwoQGEsOQONfAziC4Kripz9cF0U0xq6xi3GmlDkCZn8h5obK3ImrWvqGYTJ_RGWTYaiTZ5ORokBjoDx_IWMTT04bkGXTtYw3d5zC63dRlFvBAb1gFNc4-4jgRuGyttZo53O9_O9xUWdE6qNnEThWdIxXeAS-8_ENjpoE3aAhIQBrRR_pZCRKQBPl2dZ8I6ZgzDfosMAXwS1US3qbdiLTA_qQrzp-vMrfZzKtY7qLT-_paEFP8FCXhq8c8",
    },
  ],
  shippers: [
    {
      title: "Pick Up",
      desc: "Accept delivery requests and pick up packages.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaYZDmjvi_PwvCJm2KA10KnDyXqA7R_yhWz3-WclEEjkkXeBB7pjaZbm-fbS9icJicFkavA0q07jQOOKMxTsmTexx6drZqWigJt9ykdbuZLbsUcsctvVhJLgHVaOdCAeZ47V6Tfl8IU3hIXhTDE2wdhTBcDJH5DaPvHSHgsfUEgkMO_ffaGBsHSyG94GBE4OKNEjhIm7HRrz-lHZOOOo5DJ7CDp6vwCH-kuYXqzigfI_HtLIuUuLEHQeIsqSzVHPK6qf2i-jHIYsM",
    },
    {
      title: "Deliver",
      desc: "Deliver packages to customers on time.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKq__rYdZjNJdQa3vUod0PEsEGvN0jIFhULdFbP77DKp8-O0kolPkYqGEbIzApTgFGoi1sZ5XlyXw_nm07iXI2WjCKXB1nQn4oBTZjRWkq10OyfvPgkK1TtAUMuUCatn8VuU0gN5vXFK2GbU0cF4p111OQYj_7z_SHtXiUYCU3JvXSE-T8G1xbvND4CmQxMei-ex2Hu5eNw7YVfrKrwkz-RtolDz1JP5z0ET2kAK2qJn2nZ8KxMsTM8NbaGbBHXRvSeEtjps2sC-A",
    },
    {
      title: "Complete",
      desc: "Confirm deliveries and get paid.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPc4dKRV6g1rb5BLPm1qmXXNs1pCqt_waCc_of16Mu94qjDx_LpJTaL73w-SUQb1Y1aS_QoHCGUgNw3EKCUdEGRikKskD4xlp8dj0upSjto6BYG7m5gpSOIsSGm6vaCbfx_cAxW7wRLjibbnKOZvThElhPNy63NotKPRKjGiuNN_cLEQXrk4nrS_B2LyYfXEpafjp6OoJhOfbbgqQ_mUTSFE2PPG8RGhYfTsGpuhvCn3NmMM-aNBM9fphIXgT0ZOYFQwu30Bu0vVY",
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
                  <Link to="/vendor/add" className="btn btn-light btn-lg px-4">
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
