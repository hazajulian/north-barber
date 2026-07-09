// validateZod.js
// Valida los datos recibidos usando esquemas de Zod.

export function validateZod(schema, source = "body") {
  return (req, res, next) => {
    if (source === "body" && req.file) {
      req.body = normalizeMultipartBody(req.body);
    }

    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: result.error.flatten().fieldErrors,
      });
    }

    switch (source) {
      case "body":
        req.body = result.data;
        break;

      case "query":
        req.validatedQuery = result.data;
        break;

      case "params":
        req.validatedParams = result.data;
        break;
    }

    next();
  };
}

function normalizeMultipartBody(body) {
  const normalized = { ...body };

  for (const key in normalized) {
    const value = normalized[key];

    if (value === "true") {
      normalized[key] = true;
      continue;
    }

    if (value === "false") {
      normalized[key] = false;
      continue;
    }

    if (value !== "" && !Number.isNaN(Number(value))) {
      normalized[key] = Number(value);
    }
  }

  return normalized;
}