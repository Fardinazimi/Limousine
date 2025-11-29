import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthorized, signOut } from "../config/auth";

export default function Header() {
  const navigate = useNavigate();
  const authed = isAuthorized();
  const handleSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Hanau Limousine & Fahrservie
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            {authed ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/account">
                    Account
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light ms-2"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                {/* <Link className="nav-link" to="/signin">
                  Sign in
                </Link> */}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
