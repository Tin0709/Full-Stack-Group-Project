// backend/utils/validators.js

/* RMIT University Vietnam
Course: COSC2769 - Full Stack Development
Semester: 2025B
Assessment: Assignment 02
Author: Huynh Ngoc Nhat Mai, Nguyen Trung Tin
ID: s3926881, s3988418
*/

const usernameOK = (s) => /^[A-Za-z0-9]{8,15}$/.test(s);

const passwordOK = (s) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(
    s
  );

const minLen = (s, n = 5) => typeof s === "string" && s.trim().length >= n;

function validateRegister(body) {
  const {
    role,
    username,
    password,
    name,
    address,
    businessName,
    businessAddress,
    distributionHub,
  } = body;

  if (!["customer", "vendor", "shipper"].includes(role)) return "Invalid role";
  if (!usernameOK(username)) return "Invalid username format";
  if (!passwordOK(password)) return "Invalid password format";

  if (role === "customer") {
    if (!minLen(name) || !minLen(address)) return "Customer fields invalid";
  }
  if (role === "vendor") {
    if (!minLen(businessName) || !minLen(businessAddress))
      return "Vendor fields invalid";
  }
  if (role === "shipper") {
    if (!minLen(distributionHub)) return "Shipper distribution hub required";
  }
  return null;
}

module.exports = { usernameOK, passwordOK, minLen, validateRegister };
