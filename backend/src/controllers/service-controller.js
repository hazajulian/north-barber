// controllers/service-controller.js
// Controla las peticiones relacionadas con los servicios.

import {
  createNewServiceService,
  deleteServiceService,
  getActiveServicesService,
  getAllServicesService,
  getServiceDetailService,
  updateServiceService,
} from "../services/service-service.js";

import { sendSuccess } from "../utils/response.js";

export async function listServices(req, res, next) {
  try {
    const services = await getActiveServicesService();

    return sendSuccess(res, "Services retrieved successfully", services);
  } catch (error) {
    next(error);
  }
}

export async function listAllServices(req, res, next) {
  try {
    const services = await getAllServicesService();

    return sendSuccess(res, "All services retrieved successfully", services);
  } catch (error) {
    next(error);
  }
}

export async function getService(req, res, next) {
  try {
    const service = await getServiceDetailService(req.params.id);

    return sendSuccess(res, "Service retrieved successfully", service);
  } catch (error) {
    next(error);
  }
}

export async function createNewService(req, res, next) {
  try {
    const service = await createNewServiceService(
      req.body,
      req.user.id
    );

    return sendSuccess(res, "Service created successfully", service, 201);
  } catch (error) {
    next(error);
  }
}

export async function editService(req, res, next) {
  try {
    const service = await updateServiceService(
      req.params.id,
      req.body,
      req.user.id
    );

    return sendSuccess(res, "Service updated successfully", service);
  } catch (error) {
    next(error);
  }
}

export async function removeService(req, res, next) {
  try {
    const service = await deleteServiceService(
      req.params.id,
      req.user.id
    );

    return sendSuccess(res, "Service deleted successfully", service);
  } catch (error) {
    next(error);
  }
}