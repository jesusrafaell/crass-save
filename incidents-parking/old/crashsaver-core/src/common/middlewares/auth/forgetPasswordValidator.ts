import { body } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import messageErrorValidator from "../messageErrorValidator";
import { validatePassword } from "./registerValidator";

export const forgetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isEmail()
    .withMessage(listCodeErrors.email.code)
    .trim()
    .toLowerCase()
    .normalizeEmail(),
  messageErrorValidator,
];

export const changePasswordByEmailValidator = [
  body("token")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  body("password")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code)
    .custom(validatePassword),
  messageErrorValidator,
];


export const updateTransportTypeValidator = [
  body("transportType")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code),
  messageErrorValidator,
];

