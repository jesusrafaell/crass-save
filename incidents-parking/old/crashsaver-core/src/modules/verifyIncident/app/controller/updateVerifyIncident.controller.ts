import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
// import { UpdateVerifyIncidentService } from "../../domain/services/updateVerifyIncident.service";
import { updateIncidentValidator } from "../../../../common/middlewares/incidents/updateIncidentValidator";

class UpdateVerifyIncidentController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    // private readonly updateVerifyIncidentService = new UpdateVerifyIncidentService(),
  ) {}

  // public async updateVerifyIncidentByIncident(req: Request, res: Response) {
  //   try {
  //     const incidentId = req.body.incidentId;
  //     const data = req.body;

  //     await this.updateVerifyIncidentService.updateVerifyIncidentsByIncident(
  //       incidentId,
  //       data,
  //     );

  //     return this.responseExpress.successResponse(res, {
  //       message: "verifyIncident updated",
  //     });
  //   } catch (error) {
  //     return this.responseExpress.errorResponse(res, error as Error);
  //   }
  // }
}

export default UpdateVerifyIncidentController;
