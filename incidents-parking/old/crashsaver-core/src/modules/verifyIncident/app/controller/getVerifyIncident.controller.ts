import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import IncidentsClient from "../../../../common/adapters/proto/incidentsClient";
import { GetVerifyIncidentRequest } from "../../../../proto/incident/service";
import { verify } from "jsonwebtoken";

class GetVerifyIncidentController {
  constructor(
    private readonly _incidentService: IncidentsClient,
    private readonly responseExpress = new ResponseExpress(),
  ) {}

  public getVerificationsByIncident = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const request: GetVerifyIncidentRequest = {
        id,
      }

      this._incidentService.client.getVerifysIncidentByIncident(request, (err, response) => {
        if (err) {
          console.error(err);
          throw err
        } else {
          if (response.ok) {
            return this.responseExpress.successResponse(res, {verifications: response.verifys });
          } else {
            throw new Error("Error incident service")
          }
        }
      })
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default GetVerifyIncidentController;
