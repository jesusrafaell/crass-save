import { Router, Request } from "express";
import apicache from "apicache";
import CreateIncidentController from "../../app/controller/static/createIncidentController";
import GetIncidentController from "../../app/controller/static/getIncidentController";
import { getIncidentsValidator } from "../../../../common/middlewares/incidents/getIncidentsValidator";
import UpdateIncidentController from "../../app/controller/static/updateIncidentController";
import { updateIconIncidentValidator, updateIncidentValidator } from "../../../../common/middlewares/incidents/updateIncidentValidator";
import {
  createIncidentValidator,
  createMobileIncidentValidator,
} from "../../../../common/middlewares/incidents/createIncidentValidator";
import IncidentsClient from "../../../../common/adapters/proto/incidentsClient";
import CreateIncidentMobileController from "../../app/controller/mobile/createIncidentMobileController";
import GetIncidentMobileController from "../../app/controller/mobile/getIncidentMobileController";
import UpdateIncidentMobileController from "../../app/controller/mobile/updateIncidentMobileController";


export class IncidentRoutes {
  static get routes(): Router {
    const router = Router();

    apicache.options({
      appendKey: (req: Request) => `${req.url}${JSON.stringify(req.body)}`,
    });


    //services format ready
    const createIncidentController = new CreateIncidentController();
    const createIncidentMobileController = new CreateIncidentMobileController();
    const getIncidentController = new GetIncidentController();
    const getIncidentMobileController = new GetIncidentMobileController();
    const updateIncidentController = new UpdateIncidentController();
    const updateIncidentMobileController = new UpdateIncidentMobileController();

    //to do
    //get incident by id check to repos (incidentstatic, incidentmobile) in goutine()

    // all
    router.post("/all", getIncidentController.getAllIncidents);

    router.post(
      "/user",
      getIncidentsValidator,
      getIncidentController.getIncidentsByUser,
    );

    // static
    router.post(
      "/create",
      createIncidentValidator,
      createIncidentController.createIncidentStatic,
    );


    router.get("/static/:id", getIncidentController.getStaticIncident);

    router.get("/all/static", getIncidentController.getStaticIncidents);

    router.put(
      "/status/:id",
      updateIncidentValidator,
      updateIncidentController.StaticStatusById,
    );

    router.put(
      "/icon/:id",
      updateIconIncidentValidator,
      updateIncidentController.StaticIconById,
    );

    //mobile
    router.post(
      "/create/mobile",
      createMobileIncidentValidator,
      createIncidentMobileController.createIncidentMobile,
    );

    router.get("/mobile/:id", getIncidentMobileController.getMobileIncident);

    router.get("/all/mobile", getIncidentMobileController.getMobilesIncidents);

    router.put(
      "/mobile/status/:id",
      updateIncidentValidator,
      updateIncidentMobileController.MobileStatusById,
    );

    return router;
  }
}
