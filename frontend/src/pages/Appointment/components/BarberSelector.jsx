// BarberSelector.jsx
// Permite seleccionar el barbero para la reserva.

import "./BarberSelector.css";

function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  const baseUrl = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api/v1"
  ).replace("/api/v1", "");

  return `${baseUrl}${imageUrl}`;
}

export function BarberSelector({
  barbers,
  selectedBarberId,
  onSelectBarber,
}) {
  const hasNoPreference =
    selectedBarberId === "no-preference";

  return (
    <section className="barberSelector">
      <div className="barberSelector__header">
        <span className="eyebrow">
          Barbero
        </span>

        <h2 className="barberSelector__title">
          Elegí quién te atiende
        </h2>

        <p className="barberSelector__text">
          Podés elegir un barbero específico o dejar que asignemos
          automáticamente uno disponible.
        </p>
      </div>

      <div className="barberSelector__grid">
        <button
          type="button"
          className={`barberSelector__card barberSelector__card--auto ${
            hasNoPreference
              ? "barberSelector__card--active"
              : ""
          }`}
          onClick={() => onSelectBarber("")}
        >
          <div className="barberSelector__imageWrap barberSelector__imageWrap--auto">
            <span className="barberSelector__placeholder">
              ✦
            </span>
          </div>

          <div className="barberSelector__info">
            <h3>Sin preferencia</h3>

            <p>
              Te asignamos automáticamente un barbero disponible.
            </p>
          </div>
        </button>

        {barbers.map((barber) => {
          const isSelected =
            String(selectedBarberId) ===
            String(barber.id);

          const imageUrl = getImageUrl(
            barber.image_url
          );

          return (
            <button
              key={barber.id}
              type="button"
              className={`barberSelector__card ${
                isSelected
                  ? "barberSelector__card--active"
                  : ""
              }`}
              onClick={() =>
                onSelectBarber(barber.id)
              }
            >
              <div className="barberSelector__imageWrap">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={barber.name}
                    className="barberSelector__image"
                  />
                ) : (
                  <span className="barberSelector__placeholder">
                    {barber.name?.charAt(0) ?? "B"}
                  </span>
                )}
              </div>

              <div className="barberSelector__info">
                <h3>{barber.name}</h3>

                <p>
                  {barber.specialty ??
                    "Barbero profesional"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}