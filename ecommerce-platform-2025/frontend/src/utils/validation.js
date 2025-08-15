// Username: letters & digits only, 8–15
export const validateUsername = (v) => /^[A-Za-z0-9]{8,15}$/.test(v || "");

// Password: 8–20; ≥1 upper, ≥1 lower, ≥1 digit, ≥1 of !@#$%^&*; only those chars
export const validatePassword = (v = "") =>
  v.length >= 8 &&
  v.length <= 20 &&
  /[A-Z]/.test(v) &&
  /[a-z]/.test(v) &&
  /[0-9]/.test(v) &&
  /[!@#$%^&*]/.test(v) &&
  /^[A-Za-z0-9!@#$%^&*]+$/.test(v);

export const minLen =
  (n) =>
  (v = "") =>
    v.trim().length >= n;
