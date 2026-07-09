// Barbers.jsx
// Sección del equipo de barberos.

import { SectionTitle } from "../SectionTitle/SectionTitle";
import { BarberCard } from "../BarberCard/BarberCard";

import barberOne from "../../assets/barbers/barbero-1.png";
import barberTwo from "../../assets/barbers/barbero-2.png";
import barberThree from "../../assets/barbers/barbero-3.png";

import "./Barbers.css";

const barbers = [
  {
    name: "Lucas Romero",
    role: "Cortes clásicos",
    description:
      "Perfil prolijo, atención al detalle y terminaciones limpias para estilos clásicos y modernos.",
    image: barberOne,
    position: "center 20%",
  },
  {
    name: "Mateo Fernández",
    role: "Fade y barba",
    description:
      "Especializado en degradados, contornos definidos y arreglo de barba con acabado profesional.",
    image: barberTwo,
    position: "center 22%",
  },
  {
    name: "Nicolás Díaz",
    role: "Barbero senior",
    description:
      "Experiencia, criterio y asesoramiento para encontrar el estilo que mejor acompaña cada imagen.",
    image: barberThree,
    position: "center 20%",
  },
];

export function Barbers() {
  return (
    <section className="barbers section" id="equipo">
      <div className="container">
        <SectionTitle
          eyebrow="Equipo"
          title="Barberos con técnica, criterio y estilo."
          text="Un equipo ficticio pensado para mostrar cómo se puede presentar el talento y la experiencia dentro de una landing profesional."
        />

        <div className="barbers__grid">
          {barbers.map((barber) => (
            <BarberCard
              key={barber.name}
              {...barber}
            />
          ))}
        </div>
      </div>
    </section>
  );
}