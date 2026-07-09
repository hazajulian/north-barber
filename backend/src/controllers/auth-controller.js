// controllers/auth-controller.js
// Controla las peticiones de autenticacion del administrador.

import {
  changeEmail,
  changePassword,
  getAuthenticatedUser,
  loginAdmin,
  requestPasswordReset,
  resetPassword,
} from "../services/auth-service.js";

import { sendSuccess } from "../utils/response.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const data = await loginAdmin(
      email,
      password,
      {
        ip: req.ip,
        userAgent: req.get("user-agent"),
      }
    );

    return sendSuccess(
      res,
      "Login successful",
      data
    );
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user =
      await getAuthenticatedUser(req.user.id);

    return sendSuccess(
      res,
      "Authenticated user retrieved successfully",
      user
    );
  } catch (error) {
    next(error);
  }
}

export async function updateEmail(req, res, next) {
  try {
    const {
      newEmail,
      currentPassword,
    } = req.body;

    const result = await changeEmail(
      req.user.id,
      newEmail,
      currentPassword
    );

    return sendSuccess(
      res,
      result.message,
      result.user
    );
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const result = await changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    return sendSuccess(
      res,
      result.message
    );
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req,
  res,
  next
) {
  try {
    const { email } = req.body;

    const result =
      await requestPasswordReset(email);

    return sendSuccess(
      res,
      result.message
    );
  } catch (error) {
    next(error);
  }
}

export async function resetUserPassword(
  req,
  res,
  next
) {
  try {
    const {
      token,
      newPassword,
    } = req.body;

    const result = await resetPassword(
      token,
      newPassword
    );

    return sendSuccess(
      res,
      result.message
    );
  } catch (error) {
    next(error);
  }
}