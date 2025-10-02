import { body } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import messageErrorValidator from "../messageErrorValidator";

export const validatePassword = (value: string) => {
  if (
    !value ||
    value.length < 8 ||
    value.length > 20 ||
    !/\d/.test(value) ||
    !/[a-zA-Z]/.test(value)
  ) {
    throw new Error(listCodeErrors.password.code);
  }
  return true;
};

export const registerValidator = [
  body("first_name")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code)
    .matches(/^[^0-9]+$/)
    .withMessage(listCodeErrors.onlyLetter.code),
  body("last_name")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code)
    .matches(/^[^0-9]+$/)
    .withMessage(listCodeErrors.onlyLetter.code),
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
    .withMessage(listCodeErrors.string.code)
    .custom(validatePassword),
  body("mobile")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  body("image").optional({ nullable: true }),
  body("identification")
    .optional({ nullable: true })
    .custom((value: { type: string }) => {
      if (value.type) {
        throw new Error(listCodeErrors.identification.code);
      }

      return true;
    }),
  body("utc")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  messageErrorValidator,
];
