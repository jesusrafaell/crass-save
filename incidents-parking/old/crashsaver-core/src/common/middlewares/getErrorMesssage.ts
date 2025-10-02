import { ValidationError } from "express-validator";

interface CustomValidatorError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

interface ResValidatorError {
  path: string;
  code: string;
}

export const getErrorMessages = (
  errors: ValidationError[],
): ResValidatorError[] => {
  const errorSet = new Set<string>();
  const result: ResValidatorError[] = [];

  for (const error of errors) {
    const _error = error as CustomValidatorError;
    const customError: ResValidatorError = {
      path: _error.path,
      code: _error.msg,
    };

    if (!errorSet.has(customError.path)) {
      result.push(customError);
      errorSet.add(customError.path);
    }
  }

  return result;
};
