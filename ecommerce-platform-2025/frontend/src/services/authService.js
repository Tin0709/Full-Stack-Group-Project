// src/services/authService.js
import { api } from "./api";

/** Helpers */
const postMultipart = (url, formData) =>
  api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/** Session */
export const me = async () => {
  const { data } = await api.get("/api/auth/me");
  return data; // { id, username, role, ... }
};

export const logout = async () => {
  await api.post("/api/auth/logout");
};

export const login = async ({ username, password }) => {
  const { data } = await api.post("/api/auth/login", { username, password });
  return data; // user
};

/** Register: Customer */
export const registerCustomer = async ({
  username,
  password,
  fullName,
  address,
  profileFile,
}) => {
  const fd = new FormData();
  fd.append("role", "customer");
  fd.append("username", username);
  fd.append("password", password);
  fd.append("fullName", fullName);
  fd.append("address", address);
  if (profileFile) fd.append("profilePicture", profileFile);
  const { data } = await postMultipart("/api/auth/register", fd);
  return data;
};

/** Register: Vendor */
export const registerVendor = async ({
  username,
  password,
  businessName,
  businessAddress,
  profileFile,
}) => {
  const fd = new FormData();
  fd.append("role", "vendor");
  fd.append("username", username);
  fd.append("password", password);
  fd.append("businessName", businessName);
  fd.append("businessAddress", businessAddress);
  if (profileFile) fd.append("profilePicture", profileFile);
  const { data } = await postMultipart("/api/auth/register", fd);
  return data;
};

/** Register: Shipper */
export const registerShipper = async ({
  username,
  password,
  distributionHub,
  profileFile,
}) => {
  const fd = new FormData();
  fd.append("role", "shipper");
  fd.append("username", username);
  fd.append("password", password);
  fd.append("distributionHub", distributionHub); // "Ho Chi Minh" | "Da Nang" | "Hanoi"
  if (profileFile) fd.append("profilePicture", profileFile);
  const { data } = await postMultipart("/api/auth/register", fd);
  return data;
};
