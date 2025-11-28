// src/config/auth.js
export const ALLOWED_EMAIL = "azimifardeen@gmail.com"; // configured allowed email
export const ALLOWED_PASSWORD = "Far_1128557"; // configured allowed password

export function isAuthorized() {
  const email = (localStorage.getItem("auth_email") || "").toLowerCase();
  const pw = localStorage.getItem("auth_pw") || "";
  return email === ALLOWED_EMAIL.toLowerCase() && pw === ALLOWED_PASSWORD;
}

export function signOut() {
  localStorage.removeItem("auth_email");
  localStorage.removeItem("auth_pw");
}
