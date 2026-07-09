// Appointment.jsx
// Permite crear reservas consumiendo la API del backend.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import logo from "../../assets/logo/logo.png";

import { getServices } from "../../services/serviceService";
import { getBarbers } from "../../services/barberService";
import { getBusinessHours } from "../../services/businessHoursService";
import {
  createAppointment,
  getAvailableSlots,
} from "../../services/appointmentService";

import { ServiceSelector } from "./components/ServiceSelector";
import { BarberSelector } from "./components/BarberSelector";
import { DateSelector } from "./components/DateSelector";
import { TimeSlots } from "./components/TimeSlots";
import { AppointmentForm } from "./components/AppointmentForm";
import { AppointmentSummary } from "./components/AppointmentSummary";
import { SuccessMessage } from "./components/SuccessMessage";
import { AppointmentStepper } from "./components/AppointmentStepper";

import "./Appointment.css";

const CUSTOMER_STORAGE_KEY = "northBarberCustomer";

const INITIAL_FORM = {
  serviceId: "",
  barberChoice: "",
  barberId: "",
  appointmentDate: "",
  appointmentTime: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  notes: "",
};

const STEP_TITLES = {
  1: "Elegí tu servicio",
  2: "Elegí tu barbero",
  3: "Elegí el día",
  4: "Elegí un horario",
  5: "Completá tus datos",
  6: "Revisá tu solicitud",
};

function getSavedCustomer() {
  const savedCustomer = localStorage.getItem(
    CUSTOMER_STORAGE_KEY
  );

  if (!savedCustomer) return {};

  try {
    return JSON.parse(savedCustomer);
  } catch {
    return {};
  }
}

function normalizeSlotTime(time) {
  if (!time) return "";
  return String(time).slice(0, 5);
}

function getTodayValue() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isPastSlot(date, time) {
  if (!date || !time) return false;

  if (date !== getTodayValue()) {
    return false;
  }

  const now = new Date();
  const [hours, minutes] = String(time)
    .slice(0, 5)
    .split(":")
    .map(Number);

  const slotDate = new Date();
  slotDate.setHours(hours, minutes, 0, 0);

  return slotDate <= now;
}

export function Appointment() {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [businessHours, setBusinessHours] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [currentStep, setCurrentStep] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [error, setError] = useState("");

  const [rememberCustomer, setRememberCustomer] = useState(false);

  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM,
    ...getSavedCustomer(),
  }));

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [
          servicesData,
          barbersData,
          businessHoursData,
        ] = await Promise.all([
          getServices(),
          getBarbers(),
          getBusinessHours(),
        ]);

        setServices(servicesData);
        setBarbers(barbersData);
        setBusinessHours(businessHoursData);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    setRememberCustomer(
      Boolean(localStorage.getItem(CUSTOMER_STORAGE_KEY))
    );

    loadData();
  }, []);

  useEffect(() => {
    async function loadSlots() {
      if (
        !formData.serviceId ||
        !formData.appointmentDate ||
        !formData.barberChoice
      ) {
        setAvailableSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);

        const slots = await getAvailableSlots(
          formData.barberChoice === "specific"
            ? formData.barberId
            : null,
          formData.serviceId,
          formData.appointmentDate
        );

        setAvailableSlots(slots);
      } catch (error) {
        console.error(error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [
    formData.barberChoice,
    formData.barberId,
    formData.serviceId,
    formData.appointmentDate,
  ]);

  useEffect(() => {
    if (!rememberCustomer) return;

    localStorage.setItem(
      CUSTOMER_STORAGE_KEY,
      JSON.stringify({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
      })
    );
  }, [
    rememberCustomer,
    formData.customerName,
    formData.customerEmail,
    formData.customerPhone,
  ]);

  const selectedService = useMemo(() => {
    return services.find(
      (service) =>
        String(service.id) === String(formData.serviceId)
    );
  }, [services, formData.serviceId]);

  const selectedBarber = useMemo(() => {
    if (formData.barberChoice === "auto") return null;

    return barbers.find(
      (barber) =>
        String(barber.id) === String(formData.barberId)
    );
  }, [
    barbers,
    formData.barberChoice,
    formData.barberId,
  ]);

  const formattedSlots = useMemo(() => {
    return availableSlots
      .map((slot) => {
        const startTime = normalizeSlotTime(
          slot.start_time || slot.time || slot
        );

        return {
          ...slot,
          start_time: startTime,
          end_time: normalizeSlotTime(slot.end_time),
        };
      })
      .filter((slot) => {
        return !isPastSlot(
          formData.appointmentDate,
          slot.start_time
        );
      });
  }, [availableSlots, formData.appointmentDate]);

  useEffect(() => {
    if (!formData.appointmentTime) return;

    const selectedTimeStillAvailable = formattedSlots.some(
      (slot) => slot.start_time === formData.appointmentTime
    );

    if (!selectedTimeStillAvailable) {
      setFormData((previous) => ({
        ...previous,
        appointmentTime: "",
      }));
    }
  }, [formattedSlots, formData.appointmentTime]);

  const selectedBarberIdForSelector = useMemo(() => {
    if (formData.barberChoice === "auto") {
      return "no-preference";
    }

    if (formData.barberChoice === "specific") {
      return formData.barberId;
    }

    return "__none__";
  }, [
    formData.barberChoice,
    formData.barberId,
  ]);

  function updateFormField(name, value) {
    setError("");

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function moveToStep(step) {
    setError("");
    setCurrentStep(step);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    updateFormField(name, value);
  }

  function handleToggleRemember(event) {
    const checked = event.target.checked;

    setRememberCustomer(checked);

    if (!checked) {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    }
  }

  function handleSelectService(serviceId) {
    setError("");

    setFormData((previous) => ({
      ...previous,
      serviceId,
      barberChoice: "",
      barberId: "",
      appointmentDate: "",
      appointmentTime: "",
    }));
  }

  function handleSelectBarber(barberId) {
    setError("");

    if (!barberId) {
      setFormData((previous) => ({
        ...previous,
        barberChoice: "auto",
        barberId: "",
        appointmentDate: "",
        appointmentTime: "",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      barberChoice: "specific",
      barberId,
      appointmentDate: "",
      appointmentTime: "",
    }));
  }

  function handleSelectDate(date) {
    setError("");

    setFormData((previous) => ({
      ...previous,
      appointmentDate: date,
      appointmentTime: "",
    }));
  }

  function handleSelectTime(time) {
    updateFormField("appointmentTime", time);
  }

  function canGoToStep(step) {
    if (step <= currentStep) return true;

    if (step === 2) {
      return Boolean(formData.serviceId);
    }

    if (step === 3) {
      return Boolean(
        formData.serviceId &&
          formData.barberChoice
      );
    }

    if (step === 4) {
      return Boolean(
        formData.serviceId &&
          formData.barberChoice &&
          formData.appointmentDate
      );
    }

    if (step === 5) {
      return Boolean(
        formData.serviceId &&
          formData.barberChoice &&
          formData.appointmentDate &&
          formData.appointmentTime
      );
    }

    if (step === 6) {
      return Boolean(
        formData.serviceId &&
          formData.barberChoice &&
          formData.appointmentDate &&
          formData.appointmentTime &&
          formData.customerName &&
          formData.customerEmail &&
          formData.customerPhone
      );
    }

    return false;
  }

  function handleStepClick(step) {
    if (!canGoToStep(step)) return;
    moveToStep(step);
  }

  function handleNextStep() {
    setError("");

    if (currentStep === 1 && !formData.serviceId) {
      setError("Elegí un servicio para continuar.");
      return;
    }

    if (currentStep === 2 && !formData.barberChoice) {
      setError("Elegí un barbero o la opción sin preferencia.");
      return;
    }

    if (currentStep === 3 && !formData.appointmentDate) {
      setError("Elegí un día para continuar.");
      return;
    }

    if (currentStep === 4 && !formData.appointmentTime) {
      setError("Elegí un horario disponible.");
      return;
    }

    if (
      currentStep === 5 &&
      (
        !formData.customerName ||
        !formData.customerEmail ||
        !formData.customerPhone
      )
    ) {
      setError("Completá tus datos obligatorios.");
      return;
    }

    moveToStep(Math.min(currentStep + 1, 6));
  }

  function handlePreviousStep() {
    moveToStep(Math.max(currentStep - 1, 1));
  }

  function resetForm() {
    const savedCustomer = rememberCustomer
      ? getSavedCustomer()
      : {};

    setFormData({
      ...INITIAL_FORM,
      ...savedCustomer,
    });

    setCurrentStep(1);
    setAvailableSlots([]);
    setCreatedAppointment(null);
    setError("");
  }

  async function handleSubmit(event) {
    event?.preventDefault();

    setError("");

    if (
      !formData.serviceId ||
      !formData.barberChoice ||
      !formData.appointmentDate ||
      !formData.appointmentTime ||
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone
    ) {
      setError("Completá todos los datos obligatorios.");
      return;
    }

    if (
      isPastSlot(
        formData.appointmentDate,
        formData.appointmentTime
      )
    ) {
      setError("Ese horario ya pasó. Elegí otro horario disponible.");
      return;
    }

    try {
      setSubmitting(true);

      const appointmentData = {
        service_id: Number(formData.serviceId),
        appointment_date: formData.appointmentDate,
        start_time: `${formData.appointmentTime}:00`,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        notes: formData.notes || null,
      };

      if (formData.barberChoice === "specific") {
        appointmentData.barber_id = Number(formData.barberId);
      }

      const response = await createAppointment(appointmentData);

      setCreatedAppointment(
        response?.appointment ||
          response?.data ||
          response ||
          appointmentData
      );

      setAvailableSlots([]);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "No se pudo crear la reserva."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function renderStep() {
    if (currentStep === 1) {
      return (
        <ServiceSelector
          services={services}
          selectedServiceId={formData.serviceId}
          onSelectService={handleSelectService}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <BarberSelector
          barbers={barbers}
          selectedBarberId={selectedBarberIdForSelector}
          onSelectBarber={handleSelectBarber}
        />
      );
    }

    if (currentStep === 3) {
      return (
        <DateSelector
          selectedDate={formData.appointmentDate}
          businessHours={businessHours}
          onSelectDate={handleSelectDate}
        />
      );
    }

    if (currentStep === 4) {
      return (
        <TimeSlots
          slots={formattedSlots}
          selectedTime={formData.appointmentTime}
          loading={loadingSlots}
          onSelectTime={handleSelectTime}
        />
      );
    }

    if (currentStep === 5) {
      return (
        <AppointmentForm
          customerName={formData.customerName}
          customerEmail={formData.customerEmail}
          customerPhone={formData.customerPhone}
          notes={formData.notes}
          rememberCustomer={rememberCustomer}
          onChange={handleInputChange}
          onToggleRemember={handleToggleRemember}
        />
      );
    }

    return (
      <AppointmentSummary
        selectedService={selectedService}
        selectedBarber={selectedBarber}
        selectedDate={formData.appointmentDate}
        selectedTime={formData.appointmentTime}
        loading={submitting}
        onSubmit={handleSubmit}
      />
    );
  }

  if (loading) {
    return (
      <main className="appointmentPage">
        <section className="appointment">
          <div className="container">
            <p className="appointment__loading">
              Cargando datos...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (createdAppointment) {
    return (
      <main className="appointmentPage">
        <section className="appointment">
          <div className="appointment__container container">
            <div className="appointment__topbar">
              <Link to="/" className="appointment__back">
                <FaArrowLeft />
                Volver al inicio
              </Link>

              <div className="appointment__brand">
                <img src={logo} alt="North Barber" />
                <span>North Barber</span>
              </div>
            </div>

            <SuccessMessage
              appointment={createdAppointment}
              onCreateAnother={resetForm}
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="appointmentPage">
      <section className="appointment">
        <div className="appointment__container container">
          <div className="appointment__topbar">
            <Link to="/" className="appointment__back">
              <FaArrowLeft />
              Volver al inicio
            </Link>

            <div className="appointment__brand">
              <img src={logo} alt="North Barber" />
              <span>North Barber</span>
            </div>
          </div>

          <div className="appointment__panel">
            <AppointmentStepper
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />

            {error && (
              <p className="appointment__error">
                {error}
              </p>
            )}

            <form
              className="appointment__flow"
              onSubmit={handleSubmit}
            >
              <div className="appointment__stepHeader">
                <span>Paso {currentStep} de 6</span>
                <strong>{STEP_TITLES[currentStep]}</strong>
              </div>

              <div className="appointment__stepCard">
                {renderStep()}
              </div>

              <div className="appointment__actions">
                <button
                  type="button"
                  className="btn btn--secondary appointment__actionButton"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                >
                  Anterior
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    className="btn btn--primary appointment__actionButton"
                    onClick={handleNextStep}
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn--primary appointment__actionButton"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Enviando..."
                      : "Enviar solicitud"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}