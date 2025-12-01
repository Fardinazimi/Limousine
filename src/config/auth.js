// src/config/auth.js
export const ALLOWED_EMAIL = "fahrservice@gmail.com"; // configured allowed email
export const ALLOWED_PASSWORD = "zubair2026"; // configured allowed password

export function isAuthorized() {
  const email = (localStorage.getItem("auth_email") || "").toLowerCase();
  const pw = localStorage.getItem("auth_pw") || "";
  return email === ALLOWED_EMAIL.toLowerCase() && pw === ALLOWED_PASSWORD;
}

export function signOut() {
  localStorage.removeItem("auth_email");
  localStorage.removeItem("auth_pw");
}
