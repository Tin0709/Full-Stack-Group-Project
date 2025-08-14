// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Your Name
// ID: Your Student ID

import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content text-center">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyrVIoLx7uHiGX4s6Xb0kNUARmV4BAW7s769DJC-plzoldf_YM1OerVXlJW_9fDIUsA6o7p7kQubtFTztDWO88s24uiaMWX2b2Y8cBlp8ME4JKhDtiCSis92E2V4MYl32QDzlhE2vqDkFxbsolsA-4QFG8kcVktZL9W8XHzBg-OG62CH7Ljk59MZJ6fLbeSl2OyqmKV255sqyR6VG-GDDsgHmO4_XQRYsDOKe-mIdfO3jvFIc6Y_bO7H_ccvlOxwBLfPIGV917btY"
          alt="Not Found"
          className="notfound-image"
        />
        <h1 className="fw-bold">Oops! This page doesn't exist</h1>
        <p>
          The page you're looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <button className="btn btn-dark mt-3" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    </div>
  );
}
