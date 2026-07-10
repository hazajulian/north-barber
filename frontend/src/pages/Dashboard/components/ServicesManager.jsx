// ServicesManager.jsx
// Administra el listado, creación, edición, activación y eliminación de servicios.

import { useRef, useState } from "react";
import {
  FaCheck,
  FaEdit,
  FaPlus,
  FaPowerOff,
  FaTrash,
} from "react-icons/fa";

import {
  createService,
  deleteService,
  updateService,
} from "../../../services/serviceService";

import { ServiceForm } from "./ServiceForm";
import { ConfirmModal } from "./ConfirmModal/ConfirmModal";

import "./ServicesManager.css";

function isActiveService(service) {
  return service.is_active === true || service.is_active === 1;
}

function getServiceDuration(service) {
  return service.duration_minutes || service.duration || "-";
}

export function ServicesManager({ services, onRefresh }) {
  const formRef = useRef(null);

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [modalType, setModalType] = useState("toggle");
  const [modalError, setModalError] = useState("");

  function scrollToForm() {
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  function handleNewService() {
    setEditingService(null);
    setShowForm(true);
    setError("");
    scrollToForm();
  }

  function handleEdit(service) {
    setEditingService(service);
    setShowForm(true);
    setError("");
    scrollToForm();
  }

  function handleCancel() {
    if (loading) return;

    setEditingService(null);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(serviceData) {
    try {
      setLoading(true);
      setError("");

      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData);
      }

      await onRefresh();

      setEditingService(null);
      setShowForm(false);
    } catch (error) {
      setError(error.message || "No se pudo guardar el servicio.");
    } finally {
      setLoading(false);
    }
  }

  function openToggleModal(service) {
    setSelectedService(service);
    setModalType("toggle");
    setModalError("");
    setModalOpen(true);
  }

  function openDeleteModal(service) {
    setSelectedService(service);
    setModalType("delete");
    setModalError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (loading) return;

    setModalOpen(false);
    setSelectedService(null);
    setModalError("");
  }

  async function confirmAction() {
    if (!selectedService) return;

    try {
      setLoading(true);
      setError("");
      setModalError("");

      if (modalType === "toggle") {
        await updateService(selectedService.id, {
          ...selectedService,
          is_active: !isActiveService(selectedService),
        });
      } else {
        await deleteService(selectedService.id);
      }

      await onRefresh();

      closeModal();
    } catch (error) {
      if (error.status === 409) {
        setModalError(
          error.message ||
            "Este servicio tiene reservas asociadas y no puede eliminarse."
        );

        return;
      }

      setError(
        error.message || "No se pudo realizar la operación."
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

    if (!selectedService) {
      return "";
    }

    if (modalType === "delete") {
      return "Eliminar servicio";
    }

    return isActiveService(selectedService)
      ? "Desactivar servicio"
      : "Activar servicio";
  }

  function getModalMessage() {
    if (modalError) {
      return modalError;
    }

    if (!selectedService) {
      return "";
    }

    if (modalType === "delete") {
      return `¿Querés eliminar definitivamente el servicio "${selectedService.name}"?

Esta acción solamente será posible si el servicio no posee reservas asociadas.`;
    }

    if (isActiveService(selectedService)) {
      return `¿Querés desactivar el servicio "${selectedService.name}"?

No estará disponible para nuevas reservas, pero conservará su historial.`;
    }

    return `¿Querés volver a activar el servicio "${selectedService.name}"?

Volverá a estar disponible para nuevas reservas.`;
  }

  return (
    <>
      <div className="servicesManager">
        <div className="servicesManager__top">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleNewService}
          >
            <FaPlus />
            Nuevo servicio
          </button>
        </div>

        {error && (
          <p className="servicesManager__error">
            {error}
          </p>
        )}

        {showForm && (
          <div
            ref={formRef}
            className="servicesManager__formAnchor"
          >
            <ServiceForm
              service={editingService}
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className="servicesManager__grid">
          {services.length > 0 ? (
            services.map((service) => (
              <article
                className="servicesManager__card"
                key={service.id}
              >
                <div>
                  <h3>{service.name}</h3>

                  <p>
                    {service.description ||
                      "Sin descripción cargada."}
                  </p>
                </div>

                <div className="servicesManager__meta">
                  <span>
                    {getServiceDuration(service)} min
                  </span>

                  <strong>${service.price}</strong>
                </div>

                <div
                  className={
                    isActiveService(service)
                      ? "servicesManager__status"
                      : "servicesManager__status servicesManager__status--inactive"
                  }
                >
                  {isActiveService(service)
                    ? "Activo"
                    : "Inactivo"}
                </div>

                <div className="servicesManager__actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                  >
                    <FaEdit />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => openToggleModal(service)}
                  >
                    {isActiveService(service) ? (
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
                    className="servicesManager__delete"
                    onClick={() => openDeleteModal(service)}
                  >
                    <FaTrash />
                    Eliminar
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="servicesManager__empty">
              No hay servicios cargados.
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
        cancelText={modalError ? "" : "Cancelar"}
        danger={modalType === "delete" && !modalError}
        errorMode={Boolean(modalError)}
        onCancel={closeModal}
        onConfirm={modalError ? closeModal : confirmAction}
      />
    </>
  );
}