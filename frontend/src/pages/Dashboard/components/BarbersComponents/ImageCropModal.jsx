// ImageCropModal.jsx
// Modal para recortar imagenes antes de subirlas.

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

import "./ImageCropModal.css";

function createImage(imageSrc) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);

    image.setAttribute("crossOrigin", "anonymous");
    image.src = imageSrc;
  });
}

async function getCroppedImage(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  context.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/jpeg",
      0.92
    );
  });
}

export function ImageCropModal({
  imageSrc,
  fileName = "barber-image.jpg",
  open,
  onCancel,
  onConfirm,
}) {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback(
    (_, croppedPixels) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  async function handleConfirm() {
    if (!croppedAreaPixels) return;

    try {
      setLoading(true);

      const croppedBlob = await getCroppedImage(
        imageSrc,
        croppedAreaPixels
      );

      const croppedFile = new File(
        [croppedBlob],
        fileName,
        {
          type: "image/jpeg",
        }
      );

      onConfirm(croppedFile);
    } finally {
      setLoading(false);
    }
  }

  if (!open || !imageSrc) {
    return null;
  }

  return (
    <div className="imageCropModal">
      <div
        className="imageCropModal__overlay"
        onClick={onCancel}
      />

      <section className="imageCropModal__panel">
        <div className="imageCropModal__header">
          <div>
            <h3>Ajustar imagen</h3>
            <p>
              Mové y acercá la foto para centrar bien la cara.
            </p>
          </div>
        </div>

        <div className="imageCropModal__cropArea">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <label className="imageCropModal__zoom">
          <span>Zoom</span>

          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(event) =>
              setZoom(Number(event.target.value))
            }
          />
        </label>

        <div className="imageCropModal__actions">
          <button
            type="button"
            className="btn btn--outline"
            disabled={loading}
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn--primary"
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading ? "Procesando..." : "Usar imagen"}
          </button>
        </div>
      </section>
    </div>
  );
}