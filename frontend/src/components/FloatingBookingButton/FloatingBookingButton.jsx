// FloatingBookingButton.jsx
// Botón flotante de reserva para mobile.

import { Link } from "react-router-dom";

import "./FloatingBookingButton.css";

export function FloatingBookingButton() {
  return (
    <Link to="/appointment" className="floatingBookingButton">
      Reservar
    </Link>
  );
}