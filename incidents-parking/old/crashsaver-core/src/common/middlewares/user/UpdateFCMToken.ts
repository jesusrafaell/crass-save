import { body } from "express-validator";
import listCodeErrors from "../listCodeErrors";
import messageErrorValidator from "../messageErrorValidator";

export const udpateFCMTokenValidator = [
  body("fcm_token")
    .notEmpty()
    .withMessage(listCodeErrors.empty.code)
    .isString()
    .withMessage(listCodeErrors.string.code),
  messageErrorValidator,
];
