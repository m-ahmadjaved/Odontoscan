/**
 * Reusable input validation helpers.
 *
 * Extracted from controllers to avoid duplicating validation logic
 * across every endpoint.
 */

/**
 * Validates that required fields are present and non-empty in a request body.
 *
 * @param   {Object}   body             The request body (typically req.body)
 * @param   {string[]} requiredFields   Array of field names that must be present
 * @returns {string|null}               Error message if validation fails, else null
 *
 * @example
 *   const error = validateRequired(req.body, ['username', 'password']);
 *   if (error) return res.status(400).json({ message: error });
 */
const validateRequired = (body, requiredFields) => {
  if (!body || typeof body !== "object") {
    return "Request body is missing or invalid.";
  }

  const missing = requiredFields.filter(
    (field) =>
      body[field] === undefined ||
      body[field] === null ||
      body[field] === ""
  );

  if (missing.length > 0) {
    const plural = missing.length > 1 ? "s" : "";
    return `Missing required field${plural}: ${missing.join(", ")}`;
  }

  return null;
};

module.exports = { validateRequired };
