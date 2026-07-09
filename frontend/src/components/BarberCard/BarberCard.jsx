// BarberCard.jsx
// Card reutilizable para presentar barberos.

import "./BarberCard.css";

export function BarberCard({
  name,
  role,
  description,
  image,
  position = "center 24%",
}) {
  return (
    <article className="barberCard">
      <div className="barberCard__imageBox">
        <img
          src={image}
          alt={name}
          className="barberCard__image"
          style={{ objectPosition: position }}
        />

        <span className="barberCard__tag">
          North Barber
        </span>
      </div>

      <div className="barberCard__content">
        <span className="barberCard__role">
          {role}
        </span>

        <h3>{name}</h3>

        <p>{description}</p>
      </div>
    </article>
  );
}