import { body } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import messageErrorValidator from "../messageErrorValidator";
import { idMongoValidatgor } from "../idMongoValidator";

export const createVerifyIncidentsValidator = [
  body("incident_id")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code)
    .custom(idMongoValidatgor),
  body("option")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code)
    .isIn([1, 2, 3])
    .withMessage(listCodeErrors.numeric.code),
  messageErrorValidator,
];
