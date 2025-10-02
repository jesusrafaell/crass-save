import { Router, Request } from "express";
import apicache from "apicache";
import CreateIncidentController from "../../app/controller/static/createIncidentController";
import GetIncidentController from "../../app/controller/static/getIncidentController";
import { getIncidentsValidator } from "../../../../common/middlewares/incidents/getIncidentsValidator";
import UpdateIncidentController from "../../app/controller/static/updateIncidentController";
import { updateIncidentValidator, updateIncidentValidatorV1 } from "../../../../common/middlewares/incidents/updateIncidentValidator";
import {
  createIncidentValidator,
} from "../../../../common/middlewares/incidents/createIncidentValidator";


export class IncidentRoutesV1 {
  static get routes(): Router {
    const router = Router();

    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });


    //services format ready
    const createIncidentController = new CreateIncidentController();
    const getIncidentController = new GetIncidentController();
    const updateIncidentController = new UpdateIncidentController();

    router.post(
      "/user",
      getIncidentsValidator,
      getIncidentController.getIncidentsByUserV1,
    );

    router.post(
      "/create",
      createIncidentValidator,
      createIncidentController.createIncidentStaticV1,
    );

     router.put(
      "/:id",
      updateIncidentValidatorV1,
      updateIncidentController.StaticStatusByIdV1,
    );

    return router;
  }
}
