import { body } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import messageErrorValidator from "../messageErrorValidator";
import { validRangeLatitude, validRangeLongitude } from "../localization/putLocalizationValidator";

export const createIncidentValidator = [
  body("description")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  body("latitude")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code)
    .custom(value => validRangeLatitude(value)),
  body("longitude")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code)
    .custom(value => validRangeLongitude(value)),
  body("incident_type_id")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  messageErrorValidator,
];

export const createMobileIncidentValidator = [
  body("latitude")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code)
    .custom(value => validRangeLatitude(value)),
  body("longitude")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code)
    .custom(value => validRangeLongitude(value)),
  body("transportType")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  messageErrorValidator,
];
