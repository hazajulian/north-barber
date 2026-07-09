// controllers/barber-controller.js
// Controla las peticiones relacionadas con los barberos.

import {
  createNewBarberService,
  deleteBarberPermanentlyService,
  disableBarberService,
  getActiveBarbersService,
  getAllBarbersService,
  getBarberDetailService,
  toggleBarberService,
  updateBarberService,
} from "../services/barber-service.js";

import { sendSuccess } from "../utils/response.js";

function cleanOptionalValue(value) {
  if (
    value === "" ||
    value === undefined ||
    value === null
  ) {
    return null;
  }

  return String(value).trim();
}

function cleanRequiredValue(value) {
  return String(value || "").trim();
}

function parseBoolean(value) {
  return (
    value === true ||
    value === "true" ||
    value === "1" ||
    value === 1
  );
}

export async function listBarbers(req, res, next) {
  try {
    const barbers =
      await getActiveBarbersService();

    return sendSuccess(
      res,
      "Barbers retrieved successfully",
      barbers
    );
  } catch (error) {
    next(error);
  }
}

export async function listAllBarbers(
  req,
  res,
  next
) {
  try {
    const barbers =
      await getAllBarbersService();

    return sendSuccess(
      res,
      "All barbers retrieved successfully",
      barbers
    );
  } catch (error) {
    next(error);
  }
}

export async function getBarber(
  req,
  res,
  next
) {
  try {
    const barber =
      await getBarberDetailService(
        req.params.id
      );

    return sendSuccess(
      res,
      "Barber retrieved successfully",
      barber
    );
  } catch (error) {
    next(error);
  }
}

export async function createNewBarber(
  req,
  res,
  next
) {
  try {
    if (!req.file) {
      const error = new Error(
        "Barber image is required"
      );

      error.statusCode = 400;

      throw error;
    }

    const barberData = {
      name: cleanRequiredValue(req.body.name),
      specialty: cleanRequiredValue(
        req.body.specialty
      ),
      bio: cleanRequiredValue(req.body.bio),
      email: cleanOptionalValue(req.body.email),
      phone: cleanOptionalValue(req.body.phone),
      image_url: `/uploads/barbers/${req.file.filename}`,
    };

    const barber =
      await createNewBarberService(
        barberData,
        req.user.id
      );

    return sendSuccess(
      res,
      "Barber created successfully",
      barber,
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function editBarber(
  req,
  res,
  next
) {
  try {
    const barberData = {
      name: cleanRequiredValue(req.body.name),
      specialty: cleanRequiredValue(
        req.body.specialty
      ),
      bio: cleanRequiredValue(req.body.bio),
      email: cleanOptionalValue(req.body.email),
      phone: cleanOptionalValue(req.body.phone),
      is_active: parseBoolean(
        req.body.is_active
      ),
    };

    if (req.file) {
      barberData.image_url =
        `/uploads/barbers/${req.file.filename}`;
    }

    const barber =
      await updateBarberService(
        req.params.id,
        barberData,
        req.user.id
      );

    return sendSuccess(
      res,
      "Barber updated successfully",
      barber
    );
  } catch (error) {
    next(error);
  }
}

export async function toggleBarber(
  req,
  res,
  next
) {
  try {
    const barber =
      await toggleBarberService(
        req.params.id,
        req.user.id
      );

    return sendSuccess(
      res,
      "Barber status updated successfully",
      barber
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteBarberPermanently(
  req,
  res,
  next
) {
  try {
    const barber =
      await deleteBarberPermanentlyService(
        req.params.id,
        req.user.id
      );

    return sendSuccess(
      res,
      "Barber deleted successfully",
      barber
    );
  } catch (error) {
    next(error);
  }
}

/* Compatibilidad con la ruta DELETE antigua */

export async function removeBarber(
  req,
  res,
  next
) {
  try {
    const barber =
      await disableBarberService(
        req.params.id,
        req.user.id
      );

    return sendSuccess(
      res,
      "Barber disabled successfully",
      barber
    );
  } catch (error) {
    next(error);
  }
}