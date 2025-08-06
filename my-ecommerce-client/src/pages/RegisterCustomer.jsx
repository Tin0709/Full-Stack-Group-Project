import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function RegisterCustomer() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    address: "",
    profilePic: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setForm({ ...form, profilePic: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateForm = () => {
    const { username, password, name, address } = form;

    const usernameRegex = /^[A-Za-z0-9]{8,15}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

    if (!usernameRegex.test(username)) return "Invalid username.";
    if (!passwordRegex.test(password)) return "Invalid password.";
    if (name.length < 5) return "Name too short.";
    if (address.length < 5) return "Address too short.";
    if (!form.profilePic) return "Profile picture is required.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) return setError(validationError);

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      const res = await fetch(`${API_URL}/customer/register`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Registration successful!");
      setForm({
        username: "",
        password: "",
        name: "",
        address: "",
        profilePic: null,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Customer Registration</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Profile Picture</label>
          <input
            type="file"
            name="profilePic"
            onChange={handleChange}
            className="form-control"
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterCustomer;
