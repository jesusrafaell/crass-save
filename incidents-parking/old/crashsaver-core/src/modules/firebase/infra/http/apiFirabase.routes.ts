import { Router, Request } from "express";
import apicache from "apicache";
import PushController from "../../application/controllers/push.controller";

export class FCMPushRoutes {
  static get routes(): Router {
    const router = Router();

    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });

    const pushController = new PushController();

    router.post("/send-notification", pushController.sendNotification);

    router.post("/send-notification/all", pushController.sendNotificationAll);

    return router;
  }
}
