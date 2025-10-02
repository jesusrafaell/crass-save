
import { Router, Request } from "express";
import apicache from "apicache";
import VersionsController from "../../app/controller/version.controller";

export class VersionRoutes {
  static get routes(): Router {
    const router = Router();
    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });

    const versionsController = new VersionsController();

    // crud
    router.get("/mobile", versionsController.get);
    router.put("/mobile/:id", versionsController.update);

    return router;
  }
}
