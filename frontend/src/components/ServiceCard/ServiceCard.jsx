// ServiceCard.jsx
// Card reutilizable para presentar servicios generales.

import "./ServiceCard.css";

export function ServiceCard({
  title,
  description,
  detail,
  icon,
}) {
  return (
    <article className="serviceCard">
      <div className="serviceCard__icon">
        {icon}
      </div>

      <div className="serviceCard__content">
        <h3 className="serviceCard__title">
          {title}
        </h3>

        <p className="serviceCard__description">
          {description}
        </p>

        <span className="serviceCard__detail">
          {detail}
        </span>
      </div>
    </article>
  );
}