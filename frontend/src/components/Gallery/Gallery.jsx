// Gallery.jsx
// Sección visual de galería.

import { SectionTitle } from "../SectionTitle/SectionTitle";
import { GalleryGrid } from "../GalleryGrid/GalleryGrid";

import galleryOne from "../../assets/gallery/galeria-1.png";
import galleryTwo from "../../assets/gallery/galeria-2.png";
import galleryThree from "../../assets/gallery/galeria-3.png";
import galleryFour from "../../assets/gallery/galeria-4.png";
import galleryFive from "../../assets/gallery/galeria-5.png";
import gallerySix from "../../assets/gallery/galeria-6.png";

import "./Gallery.css";

const images = [
  {
    src: galleryOne,
    alt: "Barbero realizando un corte",
    label: "Cortes con detalle",
  },
  {
    src: galleryTwo,
    alt: "Herramientas de barbería",
    label: "Herramientas listas",
  },
  {
    src: galleryThree,
    alt: "Afeitado tradicional",
    label: "Afeitado clásico",
  },
  {
    src: galleryFour,
    alt: "Interior de North Barber",
    label: "Ambiente premium",
  },
  {
    src: galleryFive,
    alt: "Sillón clásico de barbería",
    label: "Comodidad y estilo",
  },
  {
    src: gallerySix,
    alt: "Local de North Barber",
    label: "Experiencia completa",
  },
];

export function Gallery() {
  return (
    <section className="gallery section" id="galeria">
      <div className="container">
        <SectionTitle
          eyebrow="Galería"
          title="Detalles que construyen una experiencia."
          text="Una muestra visual del ambiente, las herramientas y el cuidado estético que acompañan cada servicio."
        />

        <GalleryGrid images={images} />
      </div>
    </section>
  );
}