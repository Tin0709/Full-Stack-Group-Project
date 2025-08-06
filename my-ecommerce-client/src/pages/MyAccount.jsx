import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser, setUser } from "../redux/userSlice";

const API_URL = import.meta.env.VITE_API_URL;

function MyAccount() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setPreview(`${API_URL}/uploads/${user.profilePic}`);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await fetch(`${API_URL}/my-account/update-pic`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      dispatch(setUser(data.user)); // update Redux store
      setPreview(`${API_URL}/uploads/${data.user.profilePic}`);
      setMessage("Profile picture updated.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    dispatch(clearUser());
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="container mt-4">
      <h2>My Account</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <strong>Username:</strong> {user.username}
      </div>
      {user.name && (
        <div className="mb-3">
          <strong>Name:</strong> {user.name}
        </div>
      )}
      {user.address && (
        <div className="mb-3">
          <strong>Address:</strong> {user.address}
        </div>
      )}
      {user.businessName && (
        <div className="mb-3">
          <strong>Business Name:</strong> {user.businessName}
        </div>
      )}
      {user.businessAddress && (
        <div className="mb-3">
          <strong>Business Address:</strong> {user.businessAddress}
        </div>
      )}
      {user.hub && (
        <div className="mb-3">
          <strong>Distribution Hub:</strong> {user.hub}
        </div>
      )}
      <div className="mb-3">
        <strong>Profile Picture:</strong>
        <br />
        {preview && <img src={preview} alt="profile" width={150} />}
      </div>
      <div className="mb-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="form-control"
        />
        <button onClick={handleUpload} className="btn btn-secondary mt-2">
          Update Picture
        </button>
      </div>
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
}

export default MyAccount;
