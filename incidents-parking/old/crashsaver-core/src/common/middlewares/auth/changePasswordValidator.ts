import { body } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import { validatePassword } from "./registerValidator";
import messageErrorValidator from "../messageErrorValidator";

export const changePasswordValidation = [
  body("newPassword")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code)
    .custom(validatePassword),
  messageErrorValidator,
];
