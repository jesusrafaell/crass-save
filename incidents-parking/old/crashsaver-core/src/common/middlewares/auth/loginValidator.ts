import { body } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import messageErrorValidator from "../messageErrorValidator";

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isEmail()
    .withMessage(listCodeErrors.email.code)
    .trim()
    .toLowerCase()
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  body("so")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  messageErrorValidator,
];

export const loginGuestValidation = [
  body("utc")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  body("so")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  messageErrorValidator,
];

export const loginTruckValidation = [
  body("email")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isEmail()
    .withMessage(listCodeErrors.email.code)
    .trim()
    .toLowerCase()
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  body("licensePlate")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  body("company")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  body("so")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  messageErrorValidator,
];