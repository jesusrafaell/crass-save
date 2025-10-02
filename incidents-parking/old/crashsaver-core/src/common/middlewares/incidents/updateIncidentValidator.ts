import { body, param } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import messageErrorValidator from "../messageErrorValidator";
import { idMongoValidatgor } from "../idMongoValidator";

const statusIncidentValidator = (value: number) => {
  if (value !== 1 && value !== 2 && value !== 3) {
    throw new Error(listCodeErrors.statusIncidentInvalid.code);
  }
  return true;
};

export const updateIncidentValidator = [
  param("id")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code)
    .custom(idMongoValidatgor),
  body("status")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code)
    .custom(statusIncidentValidator),
  messageErrorValidator,
];

export const updateIconIncidentValidator = [
  param("id")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code)
    .custom(idMongoValidatgor),
  body("icon")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code),
  messageErrorValidator,
];

export const updateIncidentValidatorV1 = [
  param("id")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code)
    .custom(idMongoValidatgor),
  body("status")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  messageErrorValidator,
];
