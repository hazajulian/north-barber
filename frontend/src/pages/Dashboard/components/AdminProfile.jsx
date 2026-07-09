// AdminProfile.jsx
// Permite consultar el perfil del administrador y gestionar seguridad.

import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaShieldAlt,
  FaUserCog,
} from "react-icons/fa";

import {
  changeAdminEmail,
  changeAdminPassword,
  getAdminProfile,
  requestAdminPasswordReset,
} from "../../../services/authService";

import { ConfirmModal } from "./ConfirmModal/ConfirmModal";

import "./AdminProfile.css";

const INITIAL_EMAIL_FORM = {
  newEmail: "",
  currentPassword: "",
};

const INITIAL_PASSWORDS = {
  currentPassword: "",
  newPassword: "",
};

const INITIAL_VISIBLE_PASSWORDS = {
  emailPassword: false,
  currentPassword: false,
  newPassword: false,
};

function getProfileData(data) {
  return data?.data || data?.user || data || null;
}

function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

export function AdminProfile() {
  const [admin, setAdmin] = useState(null);

  const [emailForm, setEmailForm] =
    useState(INITIAL_EMAIL_FORM);

  const [passwords, setPasswords] =
    useState(INITIAL_PASSWORDS);

  const [visiblePasswords, setVisiblePasswords] =
    useState(INITIAL_VISIBLE_PASSWORDS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [emailModalOpen, setEmailModalOpen] =
    useState(false);

  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false);

  const [resetModalOpen, setResetModalOpen] =
    useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminProfile();
        const profile = getProfileData(data);

        setAdmin(profile);

        setEmailForm((previous) => ({
          ...previous,
          newEmail: profile?.email || "",
        }));
      } catch (error) {
        setError(
          error.message ||
            "No se pudo cargar el perfil del administrador."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleEmailChange(event) {
    const { name, value } = event.target;

    setEmailForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function togglePasswordVisibility(field) {
    setVisiblePasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  }

  function requestEmailUpdate(event) {
    event.preventDefault();
    setEmailModalOpen(true);
  }

  function requestPasswordUpdate(event) {
    event.preventDefault();
    setPasswordModalOpen(true);
  }

  async function handleUpdateEmail() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const data = await changeAdminEmail(emailForm);
      const updatedAdmin = getProfileData(data);

      setAdmin(updatedAdmin || {
        ...admin,
        email: emailForm.newEmail,
      });

      setEmailForm({
        newEmail: updatedAdmin?.email || emailForm.newEmail,
        currentPassword: "",
      });

      setEmailModalOpen(false);

      setMessage(
        "Correo actualizado correctamente."
      );
    } catch (error) {
      setError(
        error.message ||
          "No se pudo actualizar el correo."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePassword() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      await changeAdminPassword(passwords);

      setPasswords(INITIAL_PASSWORDS);
      setPasswordModalOpen(false);

      setMessage(
        "Contraseña actualizada correctamente."
      );
    } catch (error) {
      setError(
        error.message ||
          "No se pudo actualizar la contraseña."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRequestReset() {
    if (!admin?.email) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await requestAdminPasswordReset(admin.email);

      setResetModalOpen(false);

      setMessage(
        "Si el correo existe, se enviará un enlace de recuperación."
      );
    } catch (error) {
      setError(
        error.message ||
          "No se pudo solicitar la recuperación."
      );
    } finally {
      setSaving(false);
    }
  }

  const emailDisabled =
    saving ||
    !emailForm.newEmail ||
    !emailForm.currentPassword ||
    emailForm.newEmail === admin?.email;

  const passwordDisabled =
    saving ||
    !passwords.currentPassword ||
    !passwords.newPassword ||
    !isStrongPassword(passwords.newPassword);

  if (loading) {
    return (
      <div className="adminProfile">
        <p className="adminProfile__loading">
          Cargando perfil...
        </p>
      </div>
    );
  }

  return (
    <div className="adminProfile">
      <div className="adminProfile__grid">
        <article className="adminProfile__card">
          <div className="adminProfile__icon">
            <FaUserCog />
          </div>

          <div>
            <span>Administrador</span>

            <h3>Admin</h3>

            <p>
              Usuario con acceso al panel de gestión de North Barber.
            </p>
          </div>
        </article>

        <article className="adminProfile__card">
          <div className="adminProfile__icon">
            <FaEnvelope />
          </div>

          <div>
            <span>Correo de acceso</span>

            <h3>
              {admin?.email || "Sin correo disponible"}
            </h3>

            <p>
              Este correo se usa para iniciar sesión y recuperar la cuenta.
            </p>
          </div>
        </article>
      </div>

      <form
        className="adminProfile__form"
        onSubmit={requestEmailUpdate}
      >
        <div className="adminProfile__formHeader">
          <div>
            <span className="eyebrow">
              Cuenta
            </span>

            <h3>
              Cambiar correo
            </h3>

            <p>
              Para proteger la cuenta, necesitás confirmar tu contraseña actual.
            </p>
          </div>

          <FaEnvelope />
        </div>

        <div className="adminProfile__fields">
          <label>
            Nuevo correo
            <input
              type="email"
              name="newEmail"
              value={emailForm.newEmail}
              onChange={handleEmailChange}
              placeholder="correo@northbarber.com"
              autoComplete="email"
            />
          </label>

          <label>
            Contraseña actual
            <div className="adminProfile__passwordField">
              <input
                type={
                  visiblePasswords.emailPassword
                    ? "text"
                    : "password"
                }
                name="currentPassword"
                value={emailForm.currentPassword}
                onChange={handleEmailChange}
                placeholder="Confirmá tu contraseña"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  togglePasswordVisibility("emailPassword")
                }
                aria-label="Mostrar u ocultar contraseña"
              >
                {visiblePasswords.emailPassword
                  ? <FaEyeSlash />
                  : <FaEye />}
              </button>
            </div>
          </label>
        </div>

        <div className="adminProfile__actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={emailDisabled}
          >
            <FaEnvelope />
            {saving
              ? "Guardando..."
              : "Actualizar correo"}
          </button>
        </div>
      </form>

      <form
        className="adminProfile__form"
        onSubmit={requestPasswordUpdate}
      >
        <div className="adminProfile__formHeader">
          <div>
            <span className="eyebrow">
              Seguridad
            </span>

            <h3>
              Cambiar contraseña
            </h3>

            <p>
              Usá una contraseña fuerte con mayúsculas, minúsculas y números.
            </p>
          </div>

          <FaShieldAlt />
        </div>

        <div className="adminProfile__fields">
          <label>
            Contraseña actual
            <div className="adminProfile__passwordField">
              <input
                type={
                  visiblePasswords.currentPassword
                    ? "text"
                    : "password"
                }
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Ingresá tu contraseña actual"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  togglePasswordVisibility("currentPassword")
                }
                aria-label="Mostrar u ocultar contraseña"
              >
                {visiblePasswords.currentPassword
                  ? <FaEyeSlash />
                  : <FaEye />}
              </button>
            </div>
          </label>

          <label>
            Nueva contraseña
            <div className="adminProfile__passwordField">
              <input
                type={
                  visiblePasswords.newPassword
                    ? "text"
                    : "password"
                }
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  togglePasswordVisibility("newPassword")
                }
                aria-label="Mostrar u ocultar contraseña"
              >
                {visiblePasswords.newPassword
                  ? <FaEyeSlash />
                  : <FaEye />}
              </button>
            </div>
          </label>
        </div>

        <p className="adminProfile__hint">
          Debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.
        </p>

        <div className="adminProfile__actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={passwordDisabled}
          >
            <FaKey />
            {saving
              ? "Guardando..."
              : "Actualizar contraseña"}
          </button>

          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setResetModalOpen(true)}
            disabled={saving || !admin?.email}
          >
            Enviar recuperación
          </button>
        </div>

        {message && (
          <p className="adminProfile__message">
            {message}
          </p>
        )}

        {error && (
          <p className="adminProfile__error">
            {error}
          </p>
        )}
      </form>

      <ConfirmModal
        open={emailModalOpen}
        loading={saving}
        title="Actualizar correo"
        message={`Se cambiará el correo de acceso del panel administrador a:\n${emailForm.newEmail}`}
        confirmText="Actualizar correo"
        cancelText="Cancelar"
        onConfirm={handleUpdateEmail}
        onCancel={() => setEmailModalOpen(false)}
      />

      <ConfirmModal
        open={passwordModalOpen}
        loading={saving}
        title="Actualizar contraseña"
        message="¿Seguro que querés cambiar la contraseña del panel administrador?"
        confirmText="Actualizar contraseña"
        cancelText="Cancelar"
        danger
        onConfirm={handleUpdatePassword}
        onCancel={() => setPasswordModalOpen(false)}
      />

      <ConfirmModal
        open={resetModalOpen}
        loading={saving}
        title="Enviar recuperación"
        message={`Se enviará un enlace de recuperación al correo:\n${admin?.email || ""}`}
        confirmText="Enviar enlace"
        cancelText="Cancelar"
        onConfirm={handleRequestReset}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
}