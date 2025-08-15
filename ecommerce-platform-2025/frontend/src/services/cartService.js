const KEY = "cart";

/**
 * Shape: { items: [{ id, name, price, image, qty }], updatedAt }
 */
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
  else cart.items.push({ ...product, qty });
  save(cart);
  return cart;
}

export function getCartCount() {
  return getCart().items.reduce((sum, it) => sum + it.qty, 0);
}
