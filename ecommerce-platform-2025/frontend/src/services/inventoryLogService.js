
import { load, save, uid } from "./storage";

const KEY = "inventoryLogs";

export function listInventoryLogs() {
  const arr = load(KEY, []);
  // newest first
  arr.sort((a,b) => new Date(b.date) - new Date(a.date));
  return arr;
}

export function addInventoryLog({ productId, productName, delta, reason }) {
  const logs = listInventoryLogs();
  const log = {
    id: uid("inv"),
    productId,
    productName,
    delta: Number(delta || 0),
    reason: reason || "",
    date: new Date().toISOString(),
  };
  logs.push(log);
  save(KEY, logs);
  return log;
}

export function listLogsByProduct(productId) {
  return listInventoryLogs().filter(l => l.productId === productId);
}
