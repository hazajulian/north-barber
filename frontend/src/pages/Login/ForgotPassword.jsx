// ForgotPassword.jsx
// Página para solicitar recuperación de contraseña del administrador.

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaKey,
} from "react-icons/fa";

import { requestAdminPasswordReset } from "../../services/authService";

import logo from "../../assets/logo/logo.png";

import "./ForgotPassword.css";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      await requestAdminPasswordReset(email);

      setMessage(
        "Si el correo existe, se enviará un enlace para recuperar la contraseña."
      );

      setEmail("");
    } catch (error) {
      setError(
        error.message ||
          "No se pudo solicitar la recuperación."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="forgotPasswordPage">
      <section className="forgotPassword">
        <div className="forgotPassword__container container">
          <Link to="/login" className="forgotPassword__back">
            <FaArrowLeft />
            Volver al login
          </Link>

          <div className="forgotPassword__panel">
            <div className="forgotPassword__visual">
              <div className="forgotPassword__brand">
                <img src={logo} alt="North Barber" />
                <span>North Barber</span>
              </div>

              <div className="forgotPassword__visualContent">
                <span className="eyebrow">Recuperación</span>

                <h1 className="forgotPassword__title title">
                  Recuperá el acceso al panel.
                </h1>

                <p>
                  Ingresá el correo administrador y te enviaremos un enlace
                  seguro para crear una nueva contraseña.
                </p>
              </div>
            </div>

            <form
              className="forgotPassword__form"
              onSubmit={handleSubmit}
            >
              <div className="forgotPassword__formHeader">
                <div className="forgotPassword__icon">
                  <FaKey />
                </div>

                <div>
                  <h2>Olvidé mi contraseña</h2>
                  <p>Solicitá un enlace de recuperación.</p>
                </div>
              </div>

              {message && (
                <p className="forgotPassword__message">
                  {message}
                </p>
              )}

              {error && (
                <p className="forgotPassword__error">
                  {error}
                </p>
              )}

              <label className="forgotPassword__field">
                <span>Email administrador</span>

                <div className="forgotPassword__inputIcon">
                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    placeholder="admin@northbarber.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <button
                className="btn btn--primary forgotPassword__submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Enviando..."
                  : "Enviar enlace de recuperación"}
              </button>

              <p className="forgotPassword__note">
                Por seguridad, si el correo no existe, mostraremos el mismo
                mensaje de confirmación.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}