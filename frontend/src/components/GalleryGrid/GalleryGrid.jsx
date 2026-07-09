// GalleryGrid.jsx
// Grilla reutilizable de imágenes.

import "./GalleryGrid.css";

const WIDE_ITEMS = [0, 3];

export function GalleryGrid({ images }) {
  return (
    <div className="galleryGrid">
      {images.map(({ src, alt, label }, index) => (
        <figure
          key={src}
          className={`galleryGrid__item ${
            WIDE_ITEMS.includes(index)
              ? "galleryGrid__item--wide"
              : ""
          }`}
        >
          <img src={src} alt={alt} />

          <figcaption className="galleryGrid__caption">
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}