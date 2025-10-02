import { Router, Request } from "express";
import apicache from "apicache";
import TransportTypeController from "../../app/controller/getTransportType.controller";


export class TransportTypesRoutes {
  static get routes(): Router {
    const router = Router();

    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });


    const transportTypeController = new TransportTypeController();

    router.get(
      "/all",
      transportTypeController.getTransportTypes,
    );

    return router;
  }
}
