// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad Request");
    err.errors = {
      "credential": "Email or username is required",
      "password": "Password is required",
      "username": "Username is required"
    };
    err.status = 400;
    next(err);
  }
  next();
};

module.exports = { handleValidationErrors };