// BarbersManager.jsx
// Administra el listado, creación, edición, activación y eliminación de barberos.

import { useRef, useState } from "react";
import {
  FaCheck,
  FaEdit,
  FaPlus,
  FaPowerOff,
  FaTrash,
} from "react-icons/fa";

import {
  createBarber,
  deleteBarber,
  toggleBarber,
  updateBarber,
} from "../../../services/barberService";

import { getImageUrl } from "../../../utils/getImageUrl";

import { BarberForm } from "./BarbersComponents/BarberForm";
import { ConfirmModal } from "./ConfirmModal/ConfirmModal";

import "./BarbersManager.css";

function isActiveBarber(barber) {
  return barber.is_active === true || barber.is_active === 1;
}

export function BarbersManager({
  barbers,
  onRefresh,
}) {
  const formRef = useRef(null);

  const [showForm, setShowForm] = useState(false);

  const [editingBarber, setEditingBarber] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedBarber, setSelectedBarber] =
    useState(null);

  const [modalType, setModalType] =
    useState("toggle");

  const [modalError, setModalError] =
    useState("");

  function scrollToForm() {
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  function handleNewBarber() {
    setEditingBarber(null);
    setShowForm(true);
    setError("");
    scrollToForm();
  }

  function handleEdit(barber) {
    setEditingBarber(barber);
    setShowForm(true);
    setError("");
    scrollToForm();
  }

  function handleCancel() {
    if (loading) return;

    setEditingBarber(null);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(barberData) {
    try {
      setLoading(true);
      setError("");

      if (editingBarber) {
        await updateBarber(
          editingBarber.id,
          barberData
        );
      } else {
        await createBarber(barberData);
      }

      await onRefresh();

      setEditingBarber(null);
      setShowForm(false);
    } catch (error) {
      setError(
        error.message ||
          "No se pudo guardar el barbero."
      );
    } finally {
      setLoading(false);
    }
  }

  function openToggleModal(barber) {
    setSelectedBarber(barber);
    setModalType("toggle");
    setModalError("");
    setModalOpen(true);
  }

  function openDeleteModal(barber) {
    setSelectedBarber(barber);
    setModalType("delete");
    setModalError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (loading) return;

    setModalOpen(false);
    setSelectedBarber(null);
    setModalError("");
  }

  async function confirmAction() {
    if (!selectedBarber) return;

    try {
      setLoading(true);
      setError("");
      setModalError("");

      if (modalType === "toggle") {
        await toggleBarber(selectedBarber.id);
      } else {
        await deleteBarber(selectedBarber.id);
      }

      await onRefresh();

      closeModal();
    } catch (error) {
      if (error.status === 409) {
        setModalError(
          error.message ||
            "Este barbero tiene reservas asociadas y no puede eliminarse."
        );

        return;
      }

      setError(
        error.message ||
          "No se pudo realizar la operación."
      );

      closeModal();
    } finally {
      setLoading(false);
    }
  }

  function getModalTitle() {
    if (modalError) {
      return "No se puede eliminar";
    }

    if (!selectedBarber) {
      return "";
    }

    if (modalType === "delete") {
      return "Eliminar barbero";
    }

    return isActiveBarber(selectedBarber)
      ? "Desactivar barbero"
      : "Activar barbero";
  }

  function getModalMessage() {
    if (modalError) {
      return modalError;
    }

    if (!selectedBarber) {
      return "";
    }

    if (modalType === "delete") {
      return `¿Querés eliminar definitivamente a "${selectedBarber.name}"?

Esta acción solamente será posible si el barbero no posee reservas asociadas.`;
    }

    if (isActiveBarber(selectedBarber)) {
      return `¿Querés desactivar a "${selectedBarber.name}"?

No podrá recibir nuevas reservas, pero conservará todo su historial.`;
    }

    return `¿Querés volver a activar a "${selectedBarber.name}"?

Volverá a estar disponible para recibir nuevas reservas.`;
  }

  return (
    <>
      <div className="barbersManager">
        <div className="barbersManager__top">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleNewBarber}
          >
            <FaPlus />
            Nuevo barbero
          </button>
        </div>

        {error && (
          <p className="barbersManager__error">
            {error}
          </p>
        )}

        {showForm && (
          <div
            ref={formRef}
            className="barbersManager__formAnchor"
          >
            <BarberForm
              barber={editingBarber}
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className="barbersManager__grid">
          {barbers.length > 0 ? (
            barbers.map((barber) => (
              <article
                key={barber.id}
                className="barbersManager__card"
              >
                <div className="barbersManager__profile">
                  <div className="barbersManager__avatar">
                    {barber.image_url ? (
                      <img
                        src={getImageUrl(barber.image_url)}
                        alt={barber.name}
                      />
                    ) : (
                      <span>
                        {barber.name?.charAt(0) || "B"}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3>{barber.name}</h3>

                    <p>
                      {barber.specialty ||
                        "Sin especialidad cargada."}
                    </p>
                  </div>
                </div>

                <div className="barbersManager__meta">
                  <span>
                    {barber.email || "Sin email"}
                  </span>

                  <strong>
                    {isActiveBarber(barber)
                      ? "Activo"
                      : "Inactivo"}
                  </strong>
                </div>

                <div className="barbersManager__actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(barber)}
                  >
                    <FaEdit />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openToggleModal(barber)
                    }
                  >
                    {isActiveBarber(barber) ? (
                      <>
                        <FaPowerOff />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        Activar
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="barbersManager__delete"
                    onClick={() =>
                      openDeleteModal(barber)
                    }
                  >
                    <FaTrash />
                    Eliminar
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="barbersManager__empty">
              No hay barberos cargados.
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={modalOpen}
        loading={loading}
        title={getModalTitle()}
        message={getModalMessage()}
        confirmText={
          modalError
            ? "Entendido"
            : modalType === "delete"
              ? "Eliminar"
              : "Confirmar"
        }
        cancelText={
          modalError
            ? ""
            : "Cancelar"
        }
        danger={
          modalType === "delete" &&
          !modalError
        }
        errorMode={Boolean(modalError)}
        onCancel={closeModal}
        onConfirm={
          modalError
            ? closeModal
            : confirmAction
        }
      />
    </>
  );
}