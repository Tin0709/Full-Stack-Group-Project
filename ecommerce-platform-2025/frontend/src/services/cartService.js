const KEY = "cart";

/** Shape: { items: [{ id, name, price, image, qty }], updatedAt } */
export function getCart() {
  try {
    return (
      JSON.parse(localStorage.getItem(KEY)) || {
        items: [],
        updatedAt: Date.now(),
      }
    );
  } catch {
    return { items: [], updatedAt: Date.now() };
  }
}
function save(cart) {
  localStorage.setItem(KEY, JSON.stringify({ ...cart, updatedAt: Date.now() }));
}

export function addItem(product, qty = 1) {
  const cart = getCart();
  const i = cart.items.findIndex((it) => it.id === product.id);
  if (i >= 0) cart.items[i].qty += qty;
  else
    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty,
    });
  save(cart);
  return cart;
}

export function setQty(id, qty) {
  const cart = getCart();
  const n = Math.max(1, Math.min(99, Number(qty) || 1));
  const i = cart.items.findIndex((it) => it.id === id);
  if (i >= 0) {
    cart.items[i].qty = n;
    save(cart);
  }
  return cart;
}

export function removeItem(id) {
  const cart = getCart();
  cart.items = cart.items.filter((it) => it.id !== id);
  save(cart);
  return cart;
}

export function clearCart() {
  save({ items: [] });
}

export function getCartCount() {
  return getCart().items.reduce((sum, it) => sum + it.qty, 0);
}
