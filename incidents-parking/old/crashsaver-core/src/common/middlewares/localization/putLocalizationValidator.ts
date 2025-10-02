import { body } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import messageErrorValidator from "../messageErrorValidator";
import { idMongoValidatgor } from "../idMongoValidator";

export const putLocalizationvalidator = [
  body("userLatitude")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code)
    .custom(value => validRangeLatitude(value)),
  body("userLongitude")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isNumeric()
    .withMessage(listCodeErrors.numeric.code)
    .custom(value => validRangeLongitude(value)),
  body("incident_id")
    .optional()
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code)
    .custom(idMongoValidatgor),
  messageErrorValidator,
];

export const validRangeLatitude = (value:number) => {
  return rangeValidator(value, { min: -90, max: 90 });
}

export const validRangeLongitude = (value:number) => {
  return rangeValidator(value, { min: -180, max: 180 });
}

export const rangeValidator = (value: number, { min, max }: { min: number, max: number }) => {
  if (value < min || value > max) {
    throw new Error(listCodeErrors.outOfRange.code); 
  }
  return true;
};