// BarberForm.jsx
// Formulario para crear o editar barberos.

import { useEffect, useState } from "react";

import { getImageUrl } from "../../../../utils/getImageUrl";
import { ImageCropModal } from "./ImageCropModal";

import "./BarberForm.css";

const initialForm = {
  name: "",
  specialty: "",
  bio: "",
  email: "",
  phone: "",
  image: null,
  is_active: true,
};

function getFilePreview(file) {
  if (!file) return "";

  return URL.createObjectURL(file);
}

export function BarberForm({
  barber,
  loading,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(initialForm);

  const [selectedImageSrc, setSelectedImageSrc] =
    useState("");

  const [selectedImageName, setSelectedImageName] =
    useState("");

  const [imagePreview, setImagePreview] =
    useState("");

  const [cropModalOpen, setCropModalOpen] =
    useState(false);

  useEffect(() => {
    if (barber) {
      setFormData({
        name: barber.name || "",
        specialty: barber.specialty || "",
        bio: barber.bio || "",
        email: barber.email || "",
        phone: barber.phone || "",
        image: null,
        is_active: barber.is_active === 0 ? false : true,
      });

      setImagePreview(
        barber.image_url
          ? getImageUrl(barber.image_url)
          : ""
      );

      setSelectedImageSrc("");
      setSelectedImageName("");
      setCropModalOpen(false);

      return;
    }

    setFormData(initialForm);
    setImagePreview("");
    setSelectedImageSrc("");
    setSelectedImageName("");
    setCropModalOpen(false);
  }, [barber]);

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }

      if (
        selectedImageSrc &&
        selectedImageSrc.startsWith("blob:")
      ) {
        URL.revokeObjectURL(selectedImageSrc);
      }
    };
  }, [
    imagePreview,
    selectedImageSrc,
  ]);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    if (type === "checkbox") {
      setFormData((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file =
      event.target.files?.[0] || null;

    event.target.value = "";

    if (!file) return;

    const imageUrl = getFilePreview(file);

    setSelectedImageSrc((previous) => {
      if (
        previous &&
        previous.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previous);
      }

      return imageUrl;
    });

    setSelectedImageName(file.name);
    setCropModalOpen(true);
  }

  function handleCancelCrop() {
    if (
      selectedImageSrc &&
      selectedImageSrc.startsWith("blob:")
    ) {
      URL.revokeObjectURL(selectedImageSrc);
    }

    setSelectedImageSrc("");
    setSelectedImageName("");
    setCropModalOpen(false);
  }

  function handleConfirmCrop(croppedFile) {
    const previewUrl =
      getFilePreview(croppedFile);

    setImagePreview((previous) => {
      if (
        previous &&
        previous.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previous);
      }

      return previewUrl;
    });

    setFormData((previous) => ({
      ...previous,
      image: croppedFile,
    }));

    if (
      selectedImageSrc &&
      selectedImageSrc.startsWith("blob:")
    ) {
      URL.revokeObjectURL(selectedImageSrc);
    }

    setSelectedImageSrc("");
    setSelectedImageName("");
    setCropModalOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const barberData = new FormData();

    barberData.append(
      "name",
      formData.name.trim()
    );

    barberData.append(
      "specialty",
      formData.specialty.trim()
    );

    barberData.append(
      "bio",
      formData.bio.trim()
    );

    barberData.append(
      "email",
      formData.email.trim()
    );

    barberData.append(
      "phone",
      formData.phone.trim()
    );

    barberData.append(
      "is_active",
      String(formData.is_active)
    );

    if (formData.image) {
      barberData.append(
        "image",
        formData.image
      );
    }

    onSubmit(barberData);
  }

  return (
    <>
      <form
        className="barberForm"
        onSubmit={handleSubmit}
      >
        <div className="barberForm__grid">

          <label className="barberForm__field">
            <span>Nombre *</span>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="barberForm__field">
            <span>Especialidad *</span>

            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Ej: Corte clásico, fade, barba"
              required
            />
          </label>

          <label className="barberForm__field">
            <span>Email opcional</span>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label className="barberForm__field">
            <span>Teléfono opcional</span>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <div className="barberForm__field">
            <span>
              Imagen {barber ? "opcional" : "*"}
            </span>

            <label className="barberForm__imageInput">
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                required={!barber && !formData.image}
              />

              Seleccionar imagen
            </label>

            {imagePreview && (
              <div className="barberForm__imagePreview">
                <img
                  src={imagePreview}
                  alt="Vista previa del barbero"
                />
              </div>
            )}

            {formData.image && (
              <small>
                Imagen ajustada: {formData.image.name}
              </small>
            )}

            {!formData.image && barber?.image_url && (
              <small>
                Se conservará la imagen actual si no elegís una nueva.
              </small>
            )}
          </div>

          <label className="barberForm__check">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />

            <span>Barbero activo</span>
          </label>

          <label className="barberForm__field barberForm__field--full">
            <span>Bio *</span>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>

        </div>

        <div className="barberForm__actions">
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
            {loading
              ? "Guardando..."
              : "Guardar barbero"}
          </button>
        </div>
      </form>

      <ImageCropModal
        open={cropModalOpen}
        imageSrc={selectedImageSrc}
        fileName={
          selectedImageName ||
          "barber-image.jpg"
        }
        onCancel={handleCancelCrop}
        onConfirm={handleConfirmCrop}
      />
    </>
  );
}