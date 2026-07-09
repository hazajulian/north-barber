// ServiceForm.jsx
// Formulario para crear o editar servicios.

import { useEffect, useState } from "react";

import "./ServiceForm.css";

const initialForm = {
  name: "",
  description: "",
  duration_minutes: "",
  price: "",
  is_active: true,
};

export function ServiceForm({
  service,
  loading,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        duration_minutes: service.duration_minutes || "",
        price: service.price || "",
        is_active: service.is_active === 0 ? false : true,
      });

      return;
    }

    setFormData(initialForm);
  }, [service]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      duration_minutes: Number(formData.duration_minutes),
      price: Number(formData.price),
      is_active: formData.is_active,
    });
  }

  return (
    <form className="serviceForm" onSubmit={handleSubmit}>
      <div className="serviceForm__grid">
        <label className="serviceForm__field">
          <span>Nombre</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="serviceForm__field">
          <span>Duración en minutos</span>
          <input
            type="number"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            min="5"
            required
          />
        </label>

        <label className="serviceForm__field">
          <span>Precio</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </label>

        <label className="serviceForm__check">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <span>Servicio activo</span>
        </label>

        <label className="serviceForm__field serviceForm__field--full">
          <span>Descripción</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </label>
      </div>

      <div className="serviceForm__actions">
        <button
          type="button"
          className="btn btn--outline"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="btn btn--primary"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar servicio"}
        </button>
      </div>
    </form>
  );
}