
import { getProduct, updateProduct, listProducts } from "./vendorProductService";
import { addInventoryLog } from "./inventoryLogService";

function safeGetProduct(id) {
  try { return getProduct(id); } catch { /* fall through */ }
  const list = listProducts();
  return list.find(p => p.id === id) || null;
}

export function adjustStock(productId, delta, reason = "") {
  const p = safeGetProduct(productId);
  if (!p) throw new Error("Product not found");
  const nextStock = Math.max(0, Number(p.stock || 0) + Number(delta || 0));
  const updated = updateProduct(productId, { stock: nextStock });
  addInventoryLog({ productId, productName: updated.name, delta, reason });
  return updated;
}
