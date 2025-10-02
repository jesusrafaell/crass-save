import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { DtoToken } from "../../../verifyToken/domain/model/token";
import { CreateVerifyIncident } from "../../domain/model/verifyIncidents";
import IncidentsClient from "../../../../common/adapters/proto/incidentsClient";
import { CreateVerifyIncidentRequest, VerifyIncidentResponse } from "../../../../proto/incident/service";

class CreateVerifyIncidentController {
  constructor(
    private readonly _incidentService: IncidentsClient,
    private readonly responseExpress = new ResponseExpress(),
  ) {}

  public createVerifyIncident = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const user_id = _id.toString();
      const body = req.body as CreateVerifyIncident;

      const request: CreateVerifyIncidentRequest = {
        incidentId: body.incident_id,
        userId: user_id,
        option: body.option
      }

      const response: VerifyIncidentResponse = await new Promise((resolve, reject) => {
        this._incidentService.client.createVerifyIncident(request, (err, resp) => {
          if (err) {
              if (err.details) {
                return reject(new Error(err.details));
              }
              return reject(err);
            }
          resolve(resp);
        })
      })

      if (response.ok) {
        return this.responseExpress.successResponse(res, response.verify)
      }
      throw new Error("Error service incident")

    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default CreateVerifyIncidentController;
