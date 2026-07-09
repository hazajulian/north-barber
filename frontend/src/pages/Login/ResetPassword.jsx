// ResetPassword.jsx
// Página para restablecer la contraseña del administrador.

import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaShieldAlt,
} from "react-icons/fa";

import { resetAdminPassword } from "../../services/authService";

import logo from "../../assets/logo/logo.png";

import "./ResetPassword.css";

const INITIAL_FORM = {
  newPassword: "",
  confirmPassword: "",
};

function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [formData, setFormData] =
    useState(INITIAL_FORM);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");
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

    if (!token) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (!isStrongPassword(formData.newPassword)) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número."
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      await resetAdminPassword({
        token,
        newPassword: formData.newPassword,
      });

      setFormData(INITIAL_FORM);

      setMessage(
        "Contraseña restablecida correctamente. Ya podés iniciar sesión."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      setError(
        error.message ||
          "No se pudo restablecer la contraseña."
      );
    } finally {
      setLoading(false);
    }
  }

  const submitDisabled =
    loading ||
    !token ||
    !formData.newPassword ||
    !formData.confirmPassword;

  return (
    <main className="resetPasswordPage">
      <section className="resetPassword">
        <div className="resetPassword__container container">
          <Link to="/login" className="resetPassword__back">
            <FaArrowLeft />
            Volver al login
          </Link>

          <div className="resetPassword__panel">
            <div className="resetPassword__visual">
              <div className="resetPassword__brand">
                <img src={logo} alt="North Barber" />
                <span>North Barber</span>
              </div>

              <div className="resetPassword__visualContent">
                <span className="eyebrow">
                  Seguridad
                </span>

                <h1 className="resetPassword__title title">
                  Creá una nueva contraseña.
                </h1>

                <p>
                  Elegí una contraseña segura para recuperar el acceso al
                  panel administrador.
                </p>
              </div>
            </div>

            <form
              className="resetPassword__form"
              onSubmit={handleSubmit}
            >
              <div className="resetPassword__formHeader">
                <div className="resetPassword__icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <h2>Restablecer contraseña</h2>
                  <p>Completá los datos para proteger tu cuenta.</p>
                </div>
              </div>

              {!token && (
                <p className="resetPassword__error">
                  El enlace de recuperación no contiene un token válido.
                </p>
              )}

              {message && (
                <p className="resetPassword__message">
                  {message}
                </p>
              )}

              {error && (
                <p className="resetPassword__error">
                  {error}
                </p>
              )}

              <label className="resetPassword__field">
                <span>Nueva contraseña</span>

                <div className="resetPassword__password">
                  <FaKey />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showPassword
                      ? <FaEyeSlash />
                      : <FaEye />}
                  </button>
                </div>
              </label>

              <label className="resetPassword__field">
                <span>Confirmar contraseña</span>

                <div className="resetPassword__password">
                  <FaKey />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Repetí la nueva contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showConfirmPassword
                      ? <FaEyeSlash />
                      : <FaEye />}
                  </button>
                </div>
              </label>

              <p className="resetPassword__note">
                La contraseña debe tener mínimo 8 caracteres, una mayúscula,
                una minúscula y un número.
              </p>

              <button
                className="btn btn--primary resetPassword__submit"
                type="submit"
                disabled={submitDisabled}
              >
                {loading
                  ? "Guardando..."
                  : "Guardar nueva contraseña"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}