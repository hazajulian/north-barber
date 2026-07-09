// Navbar.jsx
// Barra de navegación principal con menú responsive.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiMenuAlt3,
  HiX,
} from "react-icons/hi";

import logo from "../../assets/logo/logo.png";

import "./Navbar.css";

const navLinks = [
  {
    label: "Inicio",
    href: "#inicio",
  },
  {
    label: "Servicios",
    href: "#servicios",
  },
  {
    label: "Equipo",
    href: "#equipo",
  },
  {
    label: "Galería",
    href: "#galeria",
  },
  {
    label: "Contacto",
    href: "#contacto",
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  const navbarClass = `navbar ${
    isScrolled ? "navbar--scrolled" : ""
  }`;

  const menuClass = `navbar__menu ${
    isOpen ? "navbar__menu--open" : ""
  }`;

  return (
    <header className={navbarClass}>
      <div className="navbar__container">
        <a
          href="#inicio"
          className="navbar__brand"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="North Barber"
            className="navbar__logo"
          />

          <div className="navbar__brandText">
            <span className="navbar__brandTop">
              Barber Shop
            </span>

            <span className="navbar__brandBottom">
              North Barber
            </span>
          </div>
        </a>

        <nav className={menuClass}>
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="navbar__link"
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}

          <Link
            to="/appointment"
            className="navbar__booking"
            onClick={closeMenu}
          >
            Reservar turno
          </Link>
        </nav>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Abrir menú"
          onClick={() =>
            setIsOpen((prev) => !prev)
          }
        >
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>
    </header>
  );
}