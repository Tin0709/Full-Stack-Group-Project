
// src/services/vendorProductService.js
// Simple localStorage-backed service to manage vendor products on the client.
// This allows the Vendor pages to be fully functional without a backend.
// Switch to real API calls later by replacing these methods.

const KEY = "vendorProducts";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("vendor:products:changed"));
}

export function listProducts({ q = "", sort = "updatedAt:desc" } = {}) {
  const [field, dir] = sort.split(":");
  const norm = (s) => (s || "").toString().toLowerCase();
  let items = read();
  if (q) {
    const nq = norm(q);
    items = items.filter(
      (p) =>
        norm(p.name).includes(nq) ||
        norm(p.description).includes(nq) ||
        norm(p.category).includes(nq)
    );
  }
  items.sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    if (dir === "asc") return av > bv ? 1 : -1;
    return av < bv ? 1 : -1;
  });
  return items;
}

export function getProduct(id) {
  return read().find((p) => p.id === id) || null;
}

export function createProduct(data) {
  const now = Date.now();
  const product = {
    id: uid(),
    name: data.name?.trim() || "",
    price: Number(data.price) || 0,
    description: data.description?.trim() || "",
    image: data.image || "",
    stock: Number(data.stock ?? 0) || 0,
    category: data.category?.trim() || "",
    createdAt: now,
    updatedAt: now,
    isActive: true,
  };
  const items = read();
  items.push(product);
  write(items);
  return product;
}

export function updateProduct(id, patch) {
  const items = read();
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  items[idx] = {
    ...items[idx],
    ...patch,
    price: patch.price != null ? Number(patch.price) : items[idx].price,
    stock: patch.stock != null ? Number(patch.stock) : items[idx].stock,
    updatedAt: Date.now(),
  };
  write(items);
  return items[idx];
}

export function deleteProduct(id) {
  const items = read().filter((p) => p.id !== id);
  write(items);
}

export function onProductsChanged(handler) {
  const fn = () => handler();
  window.addEventListener("vendor:products:changed", fn);
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) handler();
  });
  return () => window.removeEventListener("vendor:products:changed", fn);
}
