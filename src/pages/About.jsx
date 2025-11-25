// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="bg-dark text-white text-center d-flex align-items-center justify-content-center"
        style={{
          height: "400px",
          backgroundImage: "url('/images/limousine-hero.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-dark bg-opacity-50 p-4 rounded">
          <h1 className="display-4 fw-bold">Premium Mietwagen & Limousine Service</h1>
          <p className="lead">Luxus, Komfort und Zuverlässigkeit für jede Fahrt</p>
        </div>
      </section>

      <div className="container py-5">
        {/* About Company */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <img
              src="/images/fleet.jpg"
              alt="Our Fleet"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-md-6">
            <h2>Über Uns</h2>
            <p>
              Willkommen bei <strong>Premium Mietwagen & Limousine Service</strong>, Ihr
              zuverlässiger Partner für professionelle und luxuriöse Transporte in Deutschland.
              Unser Ziel ist es, Ihnen eine sichere, komfortable und pünktliche Fahrt zu garantieren –
              sei es für Geschäftsreisen, Flughafentransfers oder besondere Anlässe.
            </p>
            <p>
              Geleitet von <strong>Ahmad Zubair Ahmadi</strong>, kombinieren wir jahrelange Erfahrung mit
              Leidenschaft für Exzellenz. Unser Anspruch ist es, jede Fahrt zu einem unvergesslichen Erlebnis zu machen.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="row mb-5">
          <div className="col text-center">
            <h2>Warum Uns Wählen?</h2>
            <p className="lead">Exzellenter Service, auf den Sie sich verlassen können</p>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <img src="/images/driver.jpg" className="card-img-top" alt="Professional Drivers" />
              <div className="card-body">
                <h5 className="card-title">Professionelle Fahrer</h5>
                <p className="card-text">Erfahrene und freundliche Fahrer sorgen für eine sichere Fahrt.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <img src="/images/vehicle.jpg" className="card-img-top" alt="Luxurious Vehicles" />
              <div className="card-body">
                <h5 className="card-title">Luxuriöse Fahrzeuge</h5>
                <p className="card-text">Moderne Limousinen, SUVs und Business-Fahrzeuge für höchsten Komfort.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <img src="/images/support.jpg" className="card-img-top" alt="24/7 Support" />
              <div className="card-body">
                <h5 className="card-title">24/7 Service</h5>
                <p className="card-text">Rund um die Uhr erreichbar – wir kümmern uns um jede Anfrage.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-4">
            <img
              src="/images/founder.jpg"
              alt="Ahmad Zubair Ahmadi"
              className="img-fluid rounded-circle shadow-sm"
            />
          </div>
          <div className="col-md-8">
            <h2>Ahmad Zubair Ahmadi</h2>
            <p>
              Gründer & Geschäftsführer – Mit einer Vision für exzellenten Kundenservice und höchstem Luxus
              führt Ahmad Zubair Ahmadi unser Unternehmen zu neuen Höhen. Jede Fahrt unter seiner Leitung
              ist garantiert professionell, komfortabel und unvergesslich.
            </p>
          </div>
        </div>

        {/* Future Ideas Section */}
        <div className="row mb-5">
          <div className="col text-center">
            <h2>Zukunftsvision</h2>
            <p className="lead">Wir planen, unseren Service kontinuierlich zu erweitern:</p>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Elektrische Limousinen</h5>
                <p className="card-text">Nachhaltige und umweltfreundliche Fahrzeuge für moderne Mobilität.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">VIP-Abonnements</h5>
                <p className="card-text">Exklusive Pakete für regelmäßige Geschäftskunden und VIPs.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Event-Services</h5>
                <p className="card-text">Maßgeschneiderte Transportlösungen für Hochzeiten, Konferenzen und Events.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
