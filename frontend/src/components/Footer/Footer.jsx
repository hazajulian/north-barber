// Footer.jsx
// Footer principal del sitio.

import { Link } from "react-router-dom";

import logo from "../../assets/logo/logo.png";

import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__main">
          <div className="footer__brand">
            <img
              src={logo}
              alt="North Barber"
            />

            <span>North Barber</span>
          </div>

          <p>
            Landing page desarrollada como
            proyecto de portfolio para simular
            la presencia online de una barbería
            moderna.
          </p>
        </div>

        <nav
          className="footer__nav"
          aria-label="Navegación del footer"
        >
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#equipo">Equipo</a>
          <a href="#galeria">Galería</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div className="footer__contact">
          <span>
            Av. Corrientes 2418, CABA
          </span>

          <span>
            Lun a sáb · 10:00 a 20:00
          </span>

          <span>
            +54 9 11 XXXX-XXXX
          </span>
        </div>

        <div className="footer__bottom">
          <div className="footer__credits">
            <p>
              © 2026 North Barber · Proyecto
              ficticio creado únicamente con
              fines educativos y de portfolio.
            </p>

            <p className="footer__creator">
              Desarrollado por{" "}
              <a
                href="https://github.com/hazajulian"
                target="_blank"
                rel="noopener noreferrer"
              >
                Julian Haza
              </a>
            </p>
          </div>

          <Link
            to="/appointment"
            className="footer__booking"
          >
            Reservar turno
          </Link>
        </div>
      </div>
    </footer>
  );
}