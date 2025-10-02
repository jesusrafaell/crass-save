import { Router, Request } from "express";
import apicache from "apicache";
import GetVerifyTokenController from "../../app/controller/getVerifyToken.controller";
import { tokenValidator } from "../../../../common/middlewares/verifyToken/tokenValidator";

export class VerifyTokenRoutes {  
  static get routes(): Router {
    const router = Router();

    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });

    const getVerifyTokenController = new GetVerifyTokenController();

    router.post(
      "/change-password",
      tokenValidator,
      getVerifyTokenController.validForgotPassword,
    );

    return router;
  }
}
