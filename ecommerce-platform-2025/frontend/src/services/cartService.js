// src/services/cartService.js
// Local cart stored in localStorage with change notifications.
// Shape: { items: [{ id, name, price, image, qty }], updatedAt }

const KEY = "cart";

/* -------------------- internals -------------------- */
function now() {
  return Date.now();
}

function notify() {
  // same-tab listeners
  window.dispatchEvent(new CustomEvent("cart:changed"));
}

function readRaw() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function canonicalize(obj) {
  // Migrate legacy arrays -> { items: [...] }
  if (Array.isArray(obj)) {
    obj = { items: obj, updatedAt: now() };
  }
  const items = Array.isArray(obj?.items) ? obj.items : [];

  // Clean items
  const cleaned = items
    .filter((it) => it && it.id != null)
    .map((it) => ({
      id: String(it.id),
      name: String(it.name ?? ""),
      price: Number(it.price) || 0,
      image: it.image ?? "",
      qty: Math.max(1, Math.min(99, Number(it.qty) || 1)),
    }));

  return { items: cleaned, updatedAt: Number(obj?.updatedAt) || now() };
}

function save(cart) {
  const clean = canonicalize(cart);
  localStorage.setItem(KEY, JSON.stringify({ ...clean, updatedAt: now() }));
  notify();
  return clean;
}

/* -------------------- public API -------------------- */
export function getCart() {
  return canonicalize(readRaw() ?? { items: [], updatedAt: now() });
}

export function addItem(product, qty = 1) {
  const cart = getCart();
  const addQty = Math.max(1, Math.min(99, Number(qty) || 1));
  const idx = cart.items.findIndex((it) => it.id === String(product.id));

  if (idx >= 0) {
    cart.items[idx].qty = Math.min(99, cart.items[idx].qty + addQty);
  } else {
    cart.items.push({
      id: String(product.id),
      name: String(product.name ?? ""),
      price: Number(product.price) || 0,
      image: product.image ?? "",
      qty: addQty,
    });
  }

  return save(cart);
}

export function setQty(id, qty) {
  const cart = getCart();
  const n = Math.max(1, Math.min(99, Number(qty) || 1));
  const idx = cart.items.findIndex((it) => it.id === String(id));
  if (idx >= 0) cart.items[idx].qty = n;
  return save(cart);
}

export function removeItem(id) {
  const cart = getCart();
  cart.items = cart.items.filter((it) => it.id !== String(id));
  return save(cart);
}

export function clearCart() {
  return save({ items: [] });
}

export function getCartCount() {
  return getCart().items.reduce((sum, it) => sum + it.qty, 0);
}

/**
 * Subscribe to cart changes.
 * - Same tab: listens to custom "cart:changed" events.
 * - Other tabs: listens to "storage" events for the KEY.
 * Returns an unsubscribe function.
 */
export function subscribeCart(callback) {
  const onLocal = () => callback();
  const onStorage = (e) => {
    if (e.key === KEY) callback();
  };
  window.addEventListener("cart:changed", onLocal);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("cart:changed", onLocal);
    window.removeEventListener("storage", onStorage);
  };
}

/* -------- optional helpers (use or ignore) -------- */
export function getSubtotal() {
  return getCart().items.reduce((s, it) => s + it.price * it.qty, 0);
}
