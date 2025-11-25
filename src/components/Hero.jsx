import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Hero() {
  return (
    <section
      className="vh-100 d-flex align-items-center justify-content-center text-center text-white"
      style={{
        backgroundImage: "url('/images/image1.jpeg')", // Place your image in public/images
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      ></div>

      {/* Hero content */}
      <div className="position-relative px-3">
        <h1 className="display-4 fw-bold mb-3">
          Hanau Limousine Service
        </h1>
        <p className="lead mb-4">
          Exklusive Fahrten. Premium Komfort. Professionelle Chauffeure.
        </p>
        <a
          href="/contact"
          className="btn btn-light btn-lg px-4 py-2 shadow-lg"
          style={{ borderRadius: '50px', fontWeight: '500' }}
        >
          Jetzt Buchen →
        </a>
      </div>
    </section>
  );
}
