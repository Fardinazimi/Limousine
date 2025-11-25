import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div>
        <Hero />
   

      {/* Features Section */}
      <section className="py-5 text-center bg-dark text-white">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-secondary rounded">
                <h3>Premium Limousinen</h3>
                <p>Unsere Fahrzeuge bieten höchsten Komfort, Eleganz und moderne Ausstattung.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-secondary rounded">
                <h3>Professionelle Fahrer</h3>
                <p>Geschulte Chauffeure sorgen für eine sichere und diskrete Fahrt.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-secondary rounded">
                <h3>24/7 Service</h3>
                <p>Rund um die Uhr verfügbar – flexibel und zuverlässig.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-5 text-center bg-light text-dark">
        <div className="container">
          <h2 className="mb-3">Bereit für eine Luxusfahrt?</h2>
          <p className="mb-4">Kontaktieren Sie uns jetzt und erleben Sie ein unvergleichliches Fahrerlebnis.</p>
          <button className="btn btn-dark btn-lg">Kontakt aufnehmen</button>
        </div>
      </section>
    </div>
  );
}
