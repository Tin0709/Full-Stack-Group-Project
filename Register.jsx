import React, { useState } from "react";
import "./styles/register.css"; // giữ file css của bạn

const ROLES = [
  { id: "customer", title: "Customer", desc: "Buy products & track orders", img: "/img/role-customer.png" },
  { id: "vendor", title: "Vendor", desc: "List & manage your products", img: "/img/role-vendor.png" },
  { id: "shipper", title: "Shipper", desc: "Deliver orders to customers", img: "/img/role-shipper.png" },
];

// ≥8 ký tự, có ít nhất 1 chữ và 1 số
const isValidPassword = (s) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(s);

export default function Register() {
  const [role, setRole] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      setPwError("Password must be at least 8 characters and include both letters and numbers.");
      return;
    }
    setPwError("");
    // TODO: gọi API đăng ký tại đây (FormData lấy từ e.currentTarget)
    alert(`Register success for role: ${role}`);
  };

  const FormCommonFields = () => (
    <>
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" type="text" placeholder="Enter your full name" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="your@email.com" required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="password-wrap">
          <input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="At least 8 chars, letters & numbers"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-invalid={!!pwError}
            aria-describedby="pwhelp"
          />
          <button
            type="button"
            className="toggle-pass"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
        {pwError && (
          <p id="pwhelp" className="error-text">
            {pwError}
          </p>
        )}
      </div>
    </>
  );

  const renderForm = () => {
    if (!role) return <div className="role-form-placeholder"><p className="text-muted">Please select a role to continue.</p></div>;

    return (
      <form className="reg-card reg-form" onSubmit={onSubmit}>
        <h3 className="reg-title">{role.charAt(0).toUpperCase() + role.slice(1)} Register</h3>
        <div className="form-stack">
          <FormCommonFields />

          {role === "vendor" && (
            <>
              <div className="field">
                <label htmlFor="shopName">Shop name</label>
                <input id="shopName" name="shopName" type="text" placeholder="Your shop name" required />
              </div>
              <div className="field">
                <label htmlFor="shopAddr">Shop address</label>
                <input id="shopAddr" name="shopAddr" type="text" placeholder="Street, city…" required />
              </div>
              <div className="field">
                <label htmlFor="shopContact">Shop information (email or website)</label>
                <input id="shopContact" name="shopContact" type="text" placeholder="shop@mail.com or https://…" />
              </div>
            </>
          )}

          {role === "shipper" && (
            <>
              <div className="field">
                <label htmlFor="license">Driver license / ID</label>
                <input id="license" name="license" type="text" placeholder="License / ID number" required />
              </div>
            </>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Register</button>
        </div>
      </form>
    );
  };

  return (
    <main className="register-unified-page">
      {/* role selector */}
      <section className="role-pick-wrap">
        <h2 className="text-center fw-bold mb-1">Create your account</h2>
        <p className="text-center text-muted mb-4">Choose your role to get started</p>

        <div className="role-grid" role="list">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="listitem"
              className={`role-card ${role === r.id ? "is-selected" : ""}`}
              aria-pressed={role === r.id}
              onClick={() => setRole(r.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setRole(r.id); }
              }}
            >
              <div className="role-image">
                <img src={r.img} alt={`${r.title} role`} />
              </div>
              <div className="role-meta">
                <h3 className="role-title">{r.title}</h3>
                <p className="role-desc">{r.desc}</p>
              </div>
              <div className="role-check" aria-hidden>✓</div>
            </button>
          ))}
        </div>
      </section>

      {/* form */}
      <section className="role-form-wrap">{renderForm()}</section>
    </main>
  );
}
