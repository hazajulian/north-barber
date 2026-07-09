// Services.jsx
// Sección de servicios principales.

import {
  FaCut,
  FaHandSparkles,
  FaRegComments,
  FaUserTie,
} from "react-icons/fa";

import { SectionTitle } from "../SectionTitle/SectionTitle";
import { ServiceCard } from "../ServiceCard/ServiceCard";

import "./Services.css";

const services = [
  {
    icon: <FaCut />,
    title: "Corte de pelo",
    description:
      "Cortes clásicos, modernos o degradados, adaptados al estilo de cada cliente y terminados con detalle profesional.",
    detail: "Estilo, prolijidad y terminación",
  },
  {
    icon: <FaUserTie />,
    title: "Arreglo de barba",
    description:
      "Perfilado, rebaje y cuidado de barba para mantener una imagen limpia, prolija y bien definida.",
    detail: "Contornos limpios y cuidado masculino",
  },
  {
    icon: <FaHandSparkles />,
    title: "Corte + barba",
    description:
      "Una experiencia completa para renovar el look, combinando corte de cabello y arreglo de barba en una misma visita.",
    detail: "Servicio completo de imagen",
  },
  {
    icon: <FaRegComments />,
    title: "Asesoría de estilo",
    description:
      "Recomendaciones sobre corte, barba y mantenimiento según el tipo de rostro, cabello y estilo personal.",
    detail: "Acompañamiento y recomendación",
  },
];

export function Services() {
  return (
    <section className="services section" id="servicios">
      <div className="container">
        <SectionTitle
          eyebrow="Servicios"
          title="Cuidado masculino con estilo y criterio."
          text="Más que mostrar precios, esta sección presenta los servicios principales que una barbería moderna puede ofrecer."
        />

        <div className="services__grid">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              {...service}
            />
          ))}
        </div>
      </div>
    </section>
  );
}