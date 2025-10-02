import { JoiErrorFieldObject } from "../adapters/joiAdapter";

export class JoiValidationError extends Error {
  private details: JoiErrorFieldObject[] = [];

  constructor(details: JoiErrorFieldObject[]) {
    super("Validation error");
    this.name = "JoiValidationError";
    this.details = details;
  }

  getDetails(): JoiErrorFieldObject[] {
    return this.details;
  }
}
