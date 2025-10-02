import { body } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import messageErrorValidator from "../messageErrorValidator";

export const getIncidentsValidator = [
  body("userLatitude")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code),
  body("userLongitude")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code),
  body("radius")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code)
    .isInt({ min: 50, max: 1000 })
    .withMessage(listCodeErrors.radius.code),
  messageErrorValidator,
];
