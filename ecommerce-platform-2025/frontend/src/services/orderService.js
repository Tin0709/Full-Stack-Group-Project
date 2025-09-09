// src/services/orderService.js
// Tiny helper to create orders (works with cookie sessions or JWT)

/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:5001";

function getAuthHeader() {
  try {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function createOrder(orderPayload) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    // keep this for session cookies; harmless if you use JWT
    credentials: "include",
    body: JSON.stringify(orderPayload),
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON error, leave body as null
  }

  if (!res.ok) {
    const msg =
      (body?.errors?.length &&
        `Validation error:\n- ${body.errors.join("\n- ")}`) ||
      body?.message ||
      `Failed to place order (HTTP ${res.status})`;
    throw new Error(msg);
  }

  return body;
}
