// services/barber-service.js
// Gestiona la logica relacionada con los barberos.

import {
  countActiveBarberAppointments,
  createBarber,
  deleteBarber,
  deleteBarberPermanently,
  getActiveBarbers,
  getAllBarbers,
  getBarberById,
  toggleBarber,
  updateAppointmentsBarberSnapshot,
  updateBarber,
} from "../models/barber-model.js";

import { registerAuditLog } from "./audit-service.js";

export async function getActiveBarbersService() {
  return getActiveBarbers();
}

export async function getAllBarbersService() {
  return getAllBarbers();
}

export async function getBarberDetailService(id) {
  const barber = await getBarberById(id);

  if (!barber) {
    const error = new Error("Barber not found");
    error.statusCode = 404;
    throw error;
  }

  return barber;
}

export async function createNewBarberService(
  barberData,
  userId = null
) {
  const barber = await createBarber(barberData);

  await registerAuditLog({
    userId,
    action: "create_barber",
    entity: "barber",
    entityId: barber.id,
    description: `Se creo el barbero ${barber.name}.`,
  });

  return barber;
}

export async function updateBarberService(
  id,
  barberData,
  userId = null
) {
  const existingBarber =
    await getBarberDetailService(id);

  if (!barberData.image_url) {
    barberData.image_url =
      existingBarber.image_url;
  }

  const barber =
    await updateBarber(id, barberData);

  await registerAuditLog({
    userId,
    action: "update_barber",
    entity: "barber",
    entityId: barber.id,
    description: `Se actualizo el barbero ${barber.name}.`,
  });

  return barber;
}

export async function toggleBarberService(
  id,
  userId = null
) {
  const barber =
    await getBarberDetailService(id);

  const updatedBarber =
    await toggleBarber(id);

  await registerAuditLog({
    userId,
    action: updatedBarber.is_active
      ? "activate_barber"
      : "deactivate_barber",
    entity: "barber",
    entityId: updatedBarber.id,
    description: updatedBarber.is_active
      ? `Se activo el barbero ${barber.name}.`
      : `Se desactivo el barbero ${barber.name}.`,
  });

  return updatedBarber;
}

export async function deleteBarberPermanentlyService(
  id,
  userId = null
) {
  const barber =
    await getBarberDetailService(id);

  const activeAppointments =
    await countActiveBarberAppointments(id);

  if (activeAppointments > 0) {
    const error = new Error(
      `No se puede eliminar el barbero "${barber.name}" porque tiene ${activeAppointments} reserva(s) pendiente(s) o confirmada(s). Cancelalas o completalas antes de eliminarlo.`
    );

    error.statusCode = 409;

    throw error;
  }

  await updateAppointmentsBarberSnapshot(
    id,
    barber.name
  );

  const deletedBarber =
    await deleteBarberPermanently(id);

  await registerAuditLog({
    userId,
    action: "delete_barber",
    entity: "barber",
    entityId: id,
    description: `Se elimino definitivamente el barbero ${barber.name}.`,
  });

  return deletedBarber;
}

export async function disableBarberService(
  id,
  userId = null
) {
  await getBarberDetailService(id);

  const barber = await deleteBarber(id);

  await registerAuditLog({
    userId,
    action: "disable_barber",
    entity: "barber",
    entityId: barber.id,
    description: `Se desactivo el barbero ${barber.name}.`,
  });

  return barber;
}