import { Router, Request } from "express";
import apicache from "apicache";
import GetVerifyIncidentController from "../../app/controller/getVerifyIncident.controller";
import CreateVerifyIncidentController from "../../app/controller/createVerifyIncident.controller";
import DeleteVerifyIncidentController from "../../app/controller/deleteVerifyIncident.controller";
import UpdateVerifyIncidentController from "../../app/controller/updateVerifyIncident.controller";
import { createVerifyIncidentsValidator } from "../../../../common/middlewares/verifyIncidents/createVerifyIncidentsValidator";
import IncidentsClient from "../../../../common/adapters/proto/incidentsClient";

export class VerifyIncidentRoutes {
  static get routes(): Router {
    const router = Router();
    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });

    const service = new IncidentsClient()

    const createVerifyIncidentController = new CreateVerifyIncidentController(service);
    const getVerifyIncidentController = new GetVerifyIncidentController(service);
    // const updateVerifyIncidentController = new UpdateVerifyIncidentController();
    // const deleteVerifyIncidentController = new DeleteVerifyIncidentController();

    router.post(
      "/",
      createVerifyIncidentsValidator,
      createVerifyIncidentController.createVerifyIncident,
    );

    router.get("/incident/:id", getVerifyIncidentController.getVerificationsByIncident);

    // router.put(
    //   "/incident/:id",
    //   updateVerifyIncidentController.updateVerifyIncidentByIncident,
    // );

    // router.delete("/:id", deleteVerifyIncidentController.deleteVerifyIncident);
    return router;
  }
}
