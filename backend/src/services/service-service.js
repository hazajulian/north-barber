// services/service-service.js
// Gestiona la logica relacionada con los servicios.

import {
  createService,
  deleteService,
  getActiveServices,
  getAllServices,
  getServiceById,
  updateService,
} from "../models/service-model.js";

import { countAppointmentsByServiceId } from "../models/appointment-model.js";
import { registerAuditLog } from "./audit-service.js";

export async function getActiveServicesService() {
  return getActiveServices();
}

export async function getAllServicesService() {
  return getAllServices();
}

export async function getServiceDetailService(id) {
  const service = await getServiceById(id);

  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  return service;
}

export async function createNewServiceService(serviceData, userId = null) {
  const service = await createService(serviceData);

  await registerAuditLog({
    userId,
    action: "create_service",
    entity: "service",
    entityId: service.id,
    description: `Se creo el servicio ${service.name}.`,
  });

  return service;
}

export async function updateServiceService(id, serviceData, userId = null) {
  await getServiceDetailService(id);

  const service = await updateService(id, serviceData);

  await registerAuditLog({
    userId,
    action: "update_service",
    entity: "service",
    entityId: service.id,
    description: `Se actualizo el servicio ${service.name}.`,
  });

  return service;
}

export async function deleteServiceService(id, userId = null) {
  const service = await getServiceDetailService(id);

  const appointmentsCount = await countAppointmentsByServiceId(id);

  if (appointmentsCount > 0) {
    const error = new Error(
      "Este servicio tiene reservas asociadas y no puede eliminarse."
    );

    error.statusCode = 409;
    throw error;
  }

  await deleteService(id);

  await registerAuditLog({
    userId,
    action: "delete_service",
    entity: "service",
    entityId: service.id,
    description: `Se elimino el servicio ${service.name}.`,
  });

  return service;
}