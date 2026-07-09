// SectionTitle.jsx
// Título reutilizable para secciones.

import "./SectionTitle.css";

export function SectionTitle({ eyebrow, title, text, center = false }) {
  return (
    <div className={`sectionTitle ${center ? "sectionTitle--center" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="sectionTitle__title title">{title}</h2>
      {text && <p className="sectionTitle__text">{text}</p>}
    </div>
  );
}