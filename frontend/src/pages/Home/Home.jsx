// Home.jsx
// Landing principal de North Barber.

import { Navbar } from "../../components/Navbar/Navbar";
import { Hero } from "../../components/Hero/Hero";
import { Services } from "../../components/Services/Services";
import { Barbers } from "../../components/Barbers/Barbers";
import { Gallery } from "../../components/Gallery/Gallery";
import { AppointmentCta } from "../../components/AppointmentCta/AppointmentCta";
import { Contact } from "../../components/Contact/Contact";
import { Footer } from "../../components/Footer/Footer";
import { FloatingBookingButton } from "../../components/FloatingBookingButton/FloatingBookingButton";

import "./Home.css";

export function Home() {
  return (
    <>
      <Navbar />

      <main className="home">
        <Hero />
        <Services />
        <Barbers />
        <Gallery />
        <AppointmentCta />
        <Contact />
      </main>

      <Footer />
      <FloatingBookingButton />
    </>
  );
}