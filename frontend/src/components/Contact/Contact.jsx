// Contact.jsx
// Información de contacto y mapa de la barbería.

import {
  FaClock,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

import "./Contact.css";

export function Contact() {
  return (
    <section className="contact section" id="contacto">
      <div className="contact__container container">
        <div className="contact__content">
          <span className="eyebrow">Contacto</span>

          <h2 className="contact__title title">
            Encontranos en Buenos Aires.
          </h2>

          <p className="contact__text">
            Un punto de contacto simple para consultar ubicación, horarios y
            medios de comunicación de North Barber.
          </p>

          <div className="contact__card">
            <div className="contact__item">
              <span className="contact__icon">
                <FaMapMarkerAlt />
              </span>

              <p>
                <strong>Dirección</strong>
                Av. Corrientes 2418, CABA
              </p>
            </div>

            <div className="contact__item">
              <span className="contact__icon">
                <FaClock />
              </span>

              <p>
                <strong>Horario</strong>
                Lunes a sábado · 10:00 a 20:00
              </p>
            </div>

            <div className="contact__item">
              <span className="contact__icon">
                <FaWhatsapp />
              </span>

              <p>
                <strong>WhatsApp</strong>
                +54 9 11 XXXX-XXXX
              </p>
            </div>
          </div>

          <div className="contact__notice">
            <strong>Proyecto ficticio</strong>
            <span>
              Esta información se usa como ejemplo para mostrar una landing
              profesional. No corresponde a una barbería real.
            </span>
          </div>
        </div>

        <div className="contact__mapBox">
          <iframe
            className="contact__map"
            title="Ubicación de North Barber"
            src="https://www.google.com/maps?q=Av.%20Corrientes%202418%2C%20CABA&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}