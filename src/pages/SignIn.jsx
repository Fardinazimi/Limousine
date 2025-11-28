// src/pages/SignIn.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ALLOWED_EMAIL, ALLOWED_PASSWORD } from "../config/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = (location.state && location.state.from) || "/account";

  const handleSubmit = (e) => {
    e.preventDefault();
    const em = email.trim().toLowerCase();
    if (em !== ALLOWED_EMAIL.toLowerCase() || password !== ALLOWED_PASSWORD) {
      setError("Ungültige Anmeldedaten. Bitte prüfen Sie E-Mail und Passwort.");
      return;
    }
    localStorage.setItem("auth_email", em);
    localStorage.setItem("auth_pw", password);
    navigate(from, { replace: true });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-sm p-4">
            <h3 className="mb-3 text-center">Anmeldung erforderlich</h3>
            <p className="text-muted text-center mb-4">
              Bitte melden Sie sich mit der autorisierten E-Mail an, um die
              Fahrer-Abrechnung zu öffnen.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">E-Mail-Adresse</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Passwort</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passwort"
                  required
                />
              </div>
              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}
              <button type="submit" className="btn btn-primary w-100">
                Anmelden
              </button>
            </form>

            <div className="mt-3 text-center">
              <Link to="/" className="text-decoration-none">
                Zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
