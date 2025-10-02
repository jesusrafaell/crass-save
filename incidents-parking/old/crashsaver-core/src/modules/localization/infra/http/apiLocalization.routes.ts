import { Router, Request } from "express";
import apicache from "apicache";

import GetLocalizationController from "../../app/controller/getLocalizationController";
import { putLocalizationvalidator } from "../../../../common/middlewares/localization/putLocalizationValidator";
import CreateLocalizationController from "../../app/controller/createLocalizationController";
import UpdateLocalizationController from "../../app/controller/updateLocalizationController";

const router = Router();

export class LocalizationRoutes {
  static get routes(): Router {
    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });

    const createLocalizationController = new CreateLocalizationController();
    const getLocalizationController = new GetLocalizationController();
    const updateLocalizationController = new UpdateLocalizationController();

    router.post("/", createLocalizationController.create);
    router.get("/user/:userId", getLocalizationController.getById);

    router.put(
      "/",
      putLocalizationvalidator,
      updateLocalizationController.updated,
    );

    return router;
  }
}
