import { api } from "./api"; // named export from api.js

// Ensure absolute image URL when backend returns "/uploads/xxx.jpg"
const backendBase =
  (import.meta.env.VITE_API_BASE &&
    import.meta.env.VITE_API_BASE.replace(/\/$/, "")) ||
  "";

const mapProduct = (p) => {
  const imageUrl = p?.imageUrl || "";
  const absolute = imageUrl.startsWith("http")
    ? imageUrl
    : imageUrl
    ? `${backendBase}${imageUrl}`
    : "";

  return {
    id: p._id,
    name: p.name,
    price: Number(p.price ?? 0),
    description: p.description || "",
    image: absolute,
    vendorName: p.vendor?.businessName || "",
    _raw: p,
  };
};

export const fetchProducts = async ({ q, minPrice, maxPrice } = {}) => {
  const params = {};
  if (q && q.trim()) params.q = q.trim();
  if (minPrice !== undefined && minPrice !== "") params.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice !== "") params.maxPrice = maxPrice;

  const { data } = await api.get("/api/products", { params });
  return Array.isArray(data) ? data.map(mapProduct) : [];
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/api/products/${id}`);
  return mapProduct(data);
};
