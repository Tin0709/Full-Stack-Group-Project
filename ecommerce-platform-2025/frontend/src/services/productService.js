/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

import { api } from "./api";
import { mockProducts as MOCKS } from "../data/mockProducts"; // adjust path if needed

const backendBase =
  (import.meta.env.VITE_API_BASE &&
    import.meta.env.VITE_API_BASE.replace(/\/$/, "")) ||
  "";

// normalize server model ➜ UI model
const mapServer = (p) => {
  const imageUrl = p?.imageUrl || "";
  const image = imageUrl.startsWith("http")
    ? imageUrl
    : imageUrl
    ? `${backendBase}${imageUrl}`
    : "";
  return {
    id: p._id,
    name: p.name,
    price: Number(p.price ?? 0),
    description: p.description || "",
    image,
    vendorName: p.vendor?.businessName || "",
    _raw: p,
  };
};

// normalize mock model ➜ UI model
const mapMock = (m) => ({
  id: m.id, // keep the same (e.g., "p1")
  name: m.name,
  price: Number(m.price ?? 0),
  description: m.description || "",
  image: m.image || "",
  vendorName: "Demo",
  _raw: m,
});

// apply same filters to mocks as server uses
const filterMocks = ({ q, minPrice, maxPrice }) => {
  const lo = (q || "").trim().toLowerCase();
  const min =
    minPrice !== undefined && minPrice !== "" ? Number(minPrice) : -Infinity;
  const max =
    maxPrice !== undefined && maxPrice !== "" ? Number(maxPrice) : Infinity;

  return MOCKS.filter((m) => {
    const nameOk = !lo || m.name.toLowerCase().includes(lo);
    const priceOk = Number(m.price) >= min && Number(m.price) <= max;
    return nameOk && priceOk;
  }).map(mapMock);
};

// de-dupe by name+price so a DB item identical to a mock doesn’t show twice
const dedupe = (arr) => {
  const seen = new Set();
  return arr.filter((p) => {
    const key = `${p.name.toLowerCase()}|${p.price}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const fetchProducts = async ({ q, minPrice, maxPrice } = {}) => {
  const params = {};
  if (q && q.trim()) params.q = q.trim();
  if (minPrice !== undefined && minPrice !== "") params.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice !== "") params.maxPrice = maxPrice;

  // get API products
  let apiItems = [];
  try {
    const { data } = await api.get("/api/products", { params });
    apiItems = Array.isArray(data) ? data.map(mapServer) : [];
  } catch {
    apiItems = [];
  }

  // get filtered mocks and merge
  const mockItems = filterMocks({ q, minPrice, maxPrice });

  // merge, de-dupe (API first), then sort by name for stable order
  const merged = dedupe([...apiItems, ...mockItems]).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return merged;
};

export const fetchProductById = async (id) => {
  // try server first
  try {
    const { data } = await api.get(`/api/products/${id}`);
    return mapServer(data);
  } catch {
    // fallback to mocks
    const m = MOCKS.find((x) => String(x.id) === String(id));
    if (m) return mapMock(m);
    throw new Error("Product not found");
  }
};
