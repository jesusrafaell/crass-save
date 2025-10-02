import { Response } from "express";
import { JoiValidationError } from "../utils/joi-error";

class ResponseExpress {
  successResponse(res: Response, data: any) {
    return res.status(200).json({ ...data, ok: true });
  }

  errorResponse(res: Response, data: Error) {
    const errorMessage: any = {
      error: data.message,
      name: data.name,
      stack: data?.stack,
      ok: false,
    };

    console.log("Error:", errorMessage);

    if (data instanceof JoiValidationError) {
      return res
        .status(400)
        .json({ ...errorMessage, details: data.getDetails() });
    }

    return res.status(400).json(errorMessage);
  }

  authErrorResponse(res: Response, data: Error) {
    console.log("AuthError:", data);
    return res.status(401).json({
      error: data.message,
      name: data.name,
      stack: data?.stack,
      ok: false,
    });
  }
}
export default ResponseExpress;
