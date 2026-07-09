// Hero.jsx
// Hero principal de la landing.

import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";

import heroImage from "../../assets/hero/hero.png";

import "./Hero.css";

export function Hero() {
  return (
    <section
      className="hero"
      id="inicio"
    >
      <div className="hero__container container">
        <div className="hero__content">
          <div className="hero__badge">
            <span></span>
            North Barber
          </div>

          <h1 className="hero__title">
            Estilo clásico,
            <br />
            precisión moderna.
          </h1>

          <p className="hero__text">
            Cortes, afeitados y cuidado masculino en una
            barbería diseñada para quienes buscan calidad,
            comodidad y una experiencia premium en cada
            visita.
          </p>

          <div className="hero__actions">
            <Link
              to="/appointment"
              className="btn btn--primary"
            >
              <FaCalendarAlt />
              Reservar turno
            </Link>

            <a
              href="#servicios"
              className="btn btn--outline"
            >
              Ver servicios
              <FaArrowRight />
            </a>
          </div>

          <div className="hero__features">
            <div className="hero__feature">
              <strong>+8 años</strong>
              <span>de experiencia</span>
            </div>

            <div className="hero__divider"></div>

            <div className="hero__feature">
              <strong>100%</strong>
              <span>atención personalizada</span>
            </div>

            <div className="hero__divider"></div>

            <div className="hero__feature">
              <strong>Premium</strong>
              <span>productos profesionales</span>
            </div>
          </div>
        </div>

        <div className="hero__imageWrapper">
          <div className="hero__imageBox">
            <img
              src={heroImage}
              alt="Interior de North Barber"
              className="hero__image"
            />
          </div>

          <div className="hero__card">
            <span>Barbería Premium</span>

            <strong>
              Elegancia, precisión y estilo en cada
              corte.
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}