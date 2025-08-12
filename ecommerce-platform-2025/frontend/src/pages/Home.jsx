// src/pages/Home.jsx
// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Tin (Nguyen Trung Tin)
// ID: s3988418

import React from "react";
import { Link } from "react-router-dom";
import "./styles/Home.css";

const heroBg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCTFo8XZpiRheymN5_ZfFuH4kOdoRr_P9Zp-fsAD59zeFTfthoQ8jd4deWyxUeVAcDQTJVI6ITdy4Tz_-TD-HFhGd-Twj_bUNvujR0l7ccgkR10mdVrmG0_DCDelzlj4_d77V2aC-pql-3lTsfmBfipQOMrpu52r2_Tsj9N1P4J8_f1GqYa-0PiAH294dgOsDTTkz6ad-KnnjdtuqMMHoymPt7NXjcudroaF_6VMWeOgmHxiLU_5v7B1dsMdK2Hi8icwH7zVLipdRQ";

const featured = [
  {
    title: "Smart Blender",
    subtitle: "Blend smoothies effortlessly",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB29DLDFwogLjGHXwhOQYA070DBoVPGQdd0ZIBx3CDplOhzmc8jsHHsp8jVnca8NSNoRJ-XvQILfeA32lVM26pCjJVOtr102E6MB-jNYRKYl2jjQwyxEnmN0IAni1ELRjFCC3Xue4JgVjQXCsv-xz0sLY1TzhG24Il-Jh9GPISLLyqmKx6LSAauzDjEMHd3BtNtrMmaeZWTDFuST63RGHAp1j1U1_qokh14o8dTfoJq43tIu7f3AdYkj7AB5tQjsPotqj439i_byjM",
  },
  {
    title: "Cozy Sofa Set",
    subtitle: "Relax in style",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-UHC8VC_Uh5GV4flZ-jLM1f6tETYrxtubWFRqNBvkZYKrhXF35-jb8F8Ptxb8CqUTOSHt1pV5s61jhKf28mOPurYU8d3ZId7Wd_BydOQFCsz7bDX-hFaDfzrPbx0seT9bVnohQX_qN3Q4fsIyznz30LsPQ1qDm5y6x59uKlsEJwMOyoecrloRRGmsTjCaCGwnh7q7Z2AExRE4jwpgnbnaJrEQbUq8h80RZZ7Lc9FeqZleN9ICgvhKh6k9bV5laqMDmqDpOGng0Sg",
  },
  {
    title: "Summer Dress Collection",
    subtitle: "Stay trendy this season",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyHR-mYSMXtF4RgVC-ZHXQK271ObPsOdj4c1dEH_kexfP1pEvS-iXiSj59exqbcaDYEL5WXI4P204vmOZPBix3Fm9LrkRkubx8d2x51J5idn8CCbXr26ftJxwY1SrKsrbdi3wu5sZi4o_o94Uxp73Bj-DrmHKXdnQJvN6n7lvt2CrSxIujiAeRnkfxs-XWtfKLHWBobtiY_2XAwY0MtB62iBO27hrKCBx73-pPgb4OjyLX8HA_ABeoxXE-f3JFjtXZhBdH5aPH--Q",
  },
  {
    title: "Wireless Headphones",
    subtitle: "Immerse in sound",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuClFYvuERmvgq6Co6iQ5-11AxSi0beYEyaPMkfDxzkeT4IvEy2BctiiERzmO3-tm69TRNhC8rvhC8eWt15nO8zHPG8S8SKp7LteLfNhK-GwzCC2Kq6dvIrx38Mkf9CXkEk71NHO-nRtBm7YF8It_cjclmlCa_RubCWsbxMegNekoQC8bMpX2HnXK2JPRMuR0ivpXgNJsu3cL_cYRgL_elD3gNalQDL0YfBUFwx9Hk_AzprL8zEe1GQ_1LZnwxMY8TuzuFm092M_fOA",
  },
];

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

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-3">
      <h2 className="h4 fw-bold mb-1 text-dark">{title}</h2>
      {subtitle && <p className="mb-0 text-muted">{subtitle}</p>}
    </div>
  );
}

function ImageCard({ img, title, subtitle }) {
  return (
    <div className="col-12 col-sm-6 col-lg-3 d-flex">
      <div className="card shadow-sm flex-fill border-0 rounded-3 overflow-hidden">
        <div
          className="ratio ratio-1x1 bg-cover"
          style={{ backgroundImage: `url(${img})` }}
          aria-label={title}
        />
        <div className="card-body">
          <h5 className="card-title h6 mb-1">{title}</h5>
          <p className="card-text small text-muted mb-0">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ img, title, desc }) {
  return (
    <div className="col-12 col-md-4 d-flex">
      <div className="card shadow-sm flex-fill border-0 rounded-3 overflow-hidden">
        <div
          className="ratio ratio-16x9 bg-cover"
          style={{ backgroundImage: `url(${img})` }}
          aria-label={title}
        />
        <div className="card-body">
          <h5 className="h6 mb-1">{title}</h5>
          <p className="small text-muted mb-0">{desc}</p>
        </div>
      </div>
    </div>
  );
}

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

        {/* FEATURED */}
        <section className="py-5">
          <div className="container">
            <SectionHeader title="Featured Products" />
            <div className="row g-3">
              {featured.map((p) => (
                <ImageCard
                  key={p.title}
                  img={p.img}
                  title={p.title}
                  subtitle={p.subtitle}
                />
              ))}
            </div>
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
        <section className="py-5 py-lg-5 bg-light">
          <div className="container text-center">
            <h2 className="h3 fw-bold mb-2">Join MarketSquare Today</h2>
            <p className="mb-4">
              Whether you're a customer, vendor, or shipper, MarketSquare has
              something for you.
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
