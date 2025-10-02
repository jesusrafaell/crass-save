// import { validationResult } from "express-validator";
// import { Request, Response, NextFunction } from "express";
// import { getErrorMessages } from "./getErrorMesssage";

// const messageErrorValidator = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     const errorMessages = getErrorMessages(errors.array());
//     return res.status(422).json({ errors: errorMessages });
//   }
//   next();
// };

// export default messageErrorValidator;
