// ConfirmModal.jsx
// Modal reutilizable para confirmar acciones importantes.

import { useEffect } from "react";

import { FaExclamationTriangle } from "react-icons/fa";

import "./ConfirmModal.css";

export function ConfirmModal({
  open,
  loading = false,

  title = "Confirmar acción",
  message = "¿Estás seguro de continuar?",

  confirmText = "Confirmar",
  cancelText = "Cancelar",

  danger = false,
  errorMode = false,

  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.classList.add(
      "confirmModalOpen"
    );

    return () => {
      document.body.classList.remove(
        "confirmModalOpen"
      );
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="confirmModal"
      onClick={!loading ? onCancel : undefined}
    >
      <div
        className="confirmModal__panel"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div
          className={
            errorMode
              ? "confirmModal__icon confirmModal__icon--error"
              : danger
                ? "confirmModal__icon confirmModal__icon--danger"
                : "confirmModal__icon"
          }
        >
          <FaExclamationTriangle />
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirmModal__actions">
          {!errorMode && (
            <button
              type="button"
              className="btn btn--outline"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className={
              danger && !errorMode
                ? "btn confirmModal__dangerButton"
                : "btn btn--primary"
            }
            onClick={
              errorMode
                ? onCancel
                : onConfirm
            }
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : errorMode
                ? "Entendido"
                : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}