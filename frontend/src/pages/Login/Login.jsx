// Login.jsx
// Página de inicio de sesión para el administrador.

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUserShield,
} from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";

import logo from "../../assets/logo/logo.png";

import "./Login.css";

export function Login() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.message ||
          "No se pudo iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="loginPage">
      <section className="login">
        <div className="login__container container">

          <Link to="/" className="login__back">
            <FaArrowLeft />
            Volver al inicio
          </Link>

          <div className="login__panel">

            <div className="login__visual">

              <div className="login__brand">
                <img
                  src={logo}
                  alt="North Barber"
                />

                <span>North Barber</span>
              </div>

              <div className="login__visualContent">
                <span className="eyebrow">
                  Admin
                </span>

                <h1 className="login__title title">
                  Panel privado de administración.
                </h1>

                <p>
                  Gestioná servicios, barberos,
                  reservas y horarios desde un
                  solo lugar.
                </p>
              </div>

            </div>

            <form
              className="login__form"
              onSubmit={handleSubmit}
            >
              <div className="login__formHeader">

                <div className="login__icon">
                  <FaUserShield />
                </div>

                <div>
                  <h2>Iniciar sesión</h2>

                  <p>
                    Ingresá con tu cuenta de
                    administrador.
                  </p>
                </div>

              </div>

              {error && (
                <p className="login__error">
                  {error}
                </p>
              )}

              <label className="login__field">
                <span>Email</span>

                <input
                  type="email"
                  name="email"
                  placeholder="admin@northbarber.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="login__field">
                <span>Contraseña</span>

                <div className="login__password">

                  <FaLock />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="login__togglePassword"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </label>

              <Link
                to="/forgot-password"
                className="login__forgot"
              >
                ¿Olvidaste tu contraseña?
              </Link>

              <button
                className="btn btn--primary login__submit"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Ingresando..."
                  : "Entrar al panel"}
              </button>

              <p className="login__note">
                Esta sección es exclusiva para
                administradores de North Barber.
              </p>

            </form>

          </div>

        </div>
      </section>
    </main>
  );
}