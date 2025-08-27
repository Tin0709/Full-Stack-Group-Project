/* RMIT — COSC2769 — 2025B
 * Validation middleware (no external deps)
 *
 * Exposes:
 *  - validateRegistration  (POST /auth/register)
 *  - validateProduct       (POST/PUT /vendor/products)
 *  - validateOrder         (POST /orders)
 *
 * Design:
 *  - Returns 400 with { message, errors: [] } on first failure set
 *  - Does light normalization (trims strings, coerces numbers)
 */

/*
# RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Nguyen Trung Tin, Huynh Ngoc Nhat Mai
# ID: s3988418, s3926881
*/

const HEX24 = /^[0-9a-fA-F]{24}$/;
const USERNAME_RE = /^[A-Za-z0-9._-]{3,20}$/;
const PHONE_RE = /^[0-9+()\s.-]{6,}$/;

const HUBS = ["Ho Chi Minh", "Da Nang", "Hanoi"];

function s(v) {
  return typeof v === "string" ? v.trim() : "";
}

function toNumber(n) {
  if (typeof n === "number") return n;
  if (typeof n === "string" && n.trim() !== "") {
    const v = Number(n);
    return Number.isFinite(v) ? v : NaN;
  }
  return NaN;
}

function bad(res, errors) {
  return res.status(400).json({ message: "Validation error", errors });
}

/* ---------------- Registration ---------------- */
function validateRegistration(req, res, next) {
  const errors = [];
  const role = s(req.body.role);
  const username = s(req.body.username);
  const password = s(req.body.password);

  if (!["customer", "vendor", "shipper"].includes(role))
    errors.push("role must be one of: customer, vendor, shipper");

  if (!USERNAME_RE.test(username))
    errors.push("username must be 3–20 chars [A–Z,a–z,0–9,._-]");

  if (s(password).length < 6)
    errors.push("password must be at least 6 characters");

  if (role === "customer") {
    if (!s(req.body.fullName)) errors.push("fullName is required for customer");
    if (!s(req.body.address)) errors.push("address is required for customer");
  } else if (role === "vendor") {
    if (!s(req.body.businessName))
      errors.push("businessName is required for vendor");
    if (!s(req.body.businessAddress))
      errors.push("businessAddress is required for vendor");
  } else if (role === "shipper") {
    const hub = s(req.body.distributionHub);
    if (!HUBS.includes(hub))
      errors.push(
        "distributionHub must be one of: Ho Chi Minh, Da Nang, Hanoi"
      );
  }

  if (errors.length) return bad(res, errors);
  next();
}

/* ---------------- Product (create/update) ---------------- */
function validateProduct(req, res, next) {
  const errors = [];
  const name = s(req.body.name);
  const description = s(req.body.description);
  const price = toNumber(req.body.price);

  if (!name) errors.push("name is required");
  if (name && name.length > 100) errors.push("name must be ≤ 100 characters");

  if (Number.isNaN(price)) errors.push("price must be a number");
  if (!Number.isNaN(price) && price < 0) errors.push("price must be ≥ 0");

  if (description && description.length > 500)
    errors.push("description must be ≤ 500 characters");

  // Normalize so controllers get clean values (non-breaking)
  req.body.name = name;
  req.body.description = description || "";
  if (!Number.isNaN(price)) req.body.price = price;

  if (errors.length) return bad(res, errors);
  next();
}

/* ---------------- Order (create) ---------------- */
function validateOrder(req, res, next) {
  const errors = [];
  const body = req.body || {};

  // items
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("items must be a non-empty array");
  } else {
    const normItems = [];
    body.items.forEach((it, idx) => {
      const itemErrors = [];

      const productId = s(it.productId || it.product); // UI may send either
      const productName = s(it.productName || it.name); // fallback
      const quantity = toNumber(it.quantity);
      const price = toNumber(it.price);

      if (productId && !HEX24.test(productId))
        itemErrors.push(`items[${idx}].productId must be a 24-hex id`);
      if (!productId && !productName)
        itemErrors.push(
          `items[${idx}] must include productId (ObjectId) or productName`
        );

      if (Number.isNaN(quantity) || quantity < 1)
        itemErrors.push(`items[${idx}].quantity must be ≥ 1`);

      if (Number.isNaN(price) || price < 0)
        itemErrors.push(`items[${idx}].price must be ≥ 0`);

      if (itemErrors.length) errors.push(...itemErrors);

      // normalize each item (keep undefined for omitted optional keys)
      normItems.push({
        productId: productId || undefined,
        productName: productName || undefined,
        quantity: Number.isNaN(quantity) ? undefined : quantity,
        price: Number.isNaN(price) ? undefined : price,
      });
    });
    req.body.items = normItems;
  }

  // receiver
  const r = body.receiver || {};
  const rName = s(r.name);
  const rAddress = s(r.address);
  const rPhone = s(r.phone);

  if (!rName) errors.push("receiver.name is required");
  if (!rAddress) errors.push("receiver.address is required");
  if (!rPhone || !PHONE_RE.test(rPhone))
    errors.push("receiver.phone is required (digits and +()-. allowed)");

  // Keep only what we allow; controller persists this object as-is
  req.body.receiver = { name: rName, address: rAddress, phone: rPhone };

  // paymentMethod (free text in your model; keep light)
  if (body.paymentMethod && s(body.paymentMethod).length > 50)
    errors.push("paymentMethod is too long");

  // distributionHub (optional — controller can infer; validate if provided)
  if (body.distributionHub != null) {
    const hub = s(body.distributionHub);
    if (!HUBS.includes(hub))
      errors.push(
        "distributionHub must be one of: Ho Chi Minh, Da Nang, Hanoi"
      );
    req.body.distributionHub = hub;
  }

  if (errors.length) return bad(res, errors);
  next();
}

module.exports = {
  validateRegistration,
  validateProduct,
  validateOrder,
};
