// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Premium Mietwagen & Limousine Service</h5>
            <p>
              Exzellenter Luxus-Transport in Hanau, Deutschland. Professionelle
              Fahrer, luxuriöse Fahrzeuge und zuverlässiger Service rund um die
              Uhr.
            </p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Kontakt</h5>
            <ul className="list-unstyled">
              <li>
                <strong>Adresse:</strong> Lombay Straße 15 A, 63452 Hanau,
                Deutschland
              </li>
              <li>
                <strong>Telefon:</strong> +49 176 317 53301
              </li>
              <li>
                <strong>Email:</strong> info@limousine-service.de
              </li>
            </ul>
          </div>

          {/* Quick Links / Services */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Unsere Dienstleistungen</h5>
            <ul className="list-unstyled">
              <Link to="/account" className="btn btn-light mt-2">
                <li>VIP Limousinen-Service</li>
              </Link>

              <li>Flughafentransfers</li>
              <li>Event & Hochzeitsservice</li>
              <li>Geschäftsfahrten</li>
              <li>24/7 Kundenservice</li>
            </ul>
          </div>
        </div>

        <hr className="border-light" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            &copy; {new Date().getFullYear()} Premium Mietwagen & Limousine
            Service. Alle Rechte vorbehalten.
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="text-white me-3">
              Datenschutz
            </a>
            <a href="#" className="text-white me-3">
              Impressum
            </a>
            <a href="#" className="text-white">
              AGB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
