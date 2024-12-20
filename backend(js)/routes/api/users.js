// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth");
const { User } = require("../../db/models");
const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("companyName")
    .exists({ checkFalsy: true })
    .withMessage("Company Name is required."),
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Address is required."),
  check("city").exists({ checkFalsy: true }).withMessage("City is required."),
  check("state").exists({ checkFalsy: true }).withMessage("State is required."),
  check("zip").exists({ checkFalsy: true }).withMessage("ZIP is required."),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required."),
  check("role").exists({ checkFalsy: true }).withMessage("Role is required."),
  handleValidationErrors,
];

// Sign up
router.post("/", validateSignup, async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    username,
    companyName,
    address,
    city,
    state,
    zip,
    country,
    role,
  } = req.body;

  // Hash the password
  const passwordHash = bcrypt.hashSync(password);

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      passwordHash,
      companyName,
      address,
      city,
      state,
      zip,
      country,
      role,
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.status(201).json({
      user: safeUser,
    });
  } catch (error) {
    // Handle duplicate email or username
    if (error.name === "SequelizeUniqueConstraintError") {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path] = `User with that ${err.path} already exists`;
      });
      return res.status(500).json({
        message: "User already exists",
        errors: {
          email: "User with that email already exists",
          username: "User with that username already exists",
        },
      });
    }

    // Handle validation errors from Sequelize
    if (error.name === "SequelizeValidationError") {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path] = err.message;
      });
      return res.status(400).json({
        message: "Bad Request",
        errors,
      });
    }
  }
});

/* FETCH REQ

fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `AkNlzhPW-GMaTybDARiwF4aqPBvQAFKdfyEA`,
  },
  body: JSON.stringify({
    firstName: "John",
    lastName: "Doe",
    companyName: "KiKeys King",
    address: "123 Main St",
    city: "Sample City",
    state: "SC",
    zip: "12345",
    country: "USA",
    email: "admin3@example.com",
    username: "Joker132407",
    password: "HQlove123",
    role: "admin",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));

*/
module.exports = router;
