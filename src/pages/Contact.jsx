import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Kontaktieren Sie uns</h2>
        <p className="text-center mb-5">Füllen Sie das Formular aus und wir melden uns so schnell wie möglich bei Ihnen.</p>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ihr Name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">E-Mail</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ihre E-Mail-Adresse"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Telefonnummer</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ihre Telefonnummer"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">Nachricht</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ihre Nachricht"
                  required
                ></textarea>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-dark btn-lg px-5">
                  Nachricht senden
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
