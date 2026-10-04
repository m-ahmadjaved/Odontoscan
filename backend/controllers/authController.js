// authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

/**
 * Generate a signed JWT for an authenticated user.
 *
 * @param   {string} id     MongoDB ObjectId of the user
 * @param   {string} role   User role — "admin" or "forensic"
 * @returns {string}        Signed JWT valid for 1 day
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

/**
 * Authenticate a user and return a JWT.
 *
 * Validates that username and password are present, verifies credentials
 * against the stored bcrypt hash, and issues a JWT on success.
 *
 * Security notes:
 *   - The same "Invalid credentials" message is returned for both a
 *     non-existent user and a wrong password. This prevents attackers
 *     from using the endpoint to enumerate valid usernames.
 *   - Plaintext passwords and password hashes are never logged.
 *   - Internal error details are logged server-side only; clients
 *     receive a generic message.
 *
 * @param   {Object} req            Express request object
 * @param   {Object} req.body       Must contain { username, password }
 * @param   {Object} res            Express response object
 * @returns {Object}                200 with { message, token, role } on success
 *                                  400 if username or password is missing
 *                                  401 if credentials are invalid
 *                                  500 on unexpected server error
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Input validation — fail fast on missing fields
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    // 2. Look up the user
    const user = await User.findOne({ username });

    // 3. Same message for both "no user" and "wrong password" —
    //    never reveal which one was wrong.
    const invalidCredentialsError = () => {
      res.status(401).json({ message: "Invalid credentials." });
    };

    if (!user) {
      return invalidCredentialsError();
    }

    // 4. Compare the provided password against the stored hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return invalidCredentialsError();
    }

    // 5. Issue a token
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      message: "Login successful.",
      token,
      role: user.role,
    });
  } catch (error) {
    // 6. Log the full error server-side, return a generic message to the client
    console.error("[authController.login] Unexpected error:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};
