import { Request, Response } from "express";
import ResponseExpress from "../../../../../common/adapters/responseExpressAdapter";
import { DtoToken } from "../../../../verifyToken/domain/model/token";
import {
  CreateIncidentMobileRequest,
  IncidentMobileResponse,
  Status,
} from "../../../../../proto/incident/service";
import IncidentsClient from "../../../../../common/adapters/proto/incidentsClient";
import { IncidentNotification } from "../../../../firebase/domain/services/incidentNotification";
import { CreateIncidentMobile } from "../../../domain/model/mobileIncident";

class CreateIncidentMobileController {
  private service!: IncidentsClient;
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly incidentNotification = new IncidentNotification(),
  ) {}

  public createIncidentMobile = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const user_id = _id.toString();
      const body = req.body as CreateIncidentMobile;

      const response: IncidentMobileResponse = await new Promise(
        (resolve, reject) => {
          this.service = new IncidentsClient();
          const request: CreateIncidentMobileRequest = {
            latitude: body.latitude,
            longitude: body.longitude,
            userId: user_id,
            transportId: body.transportType,
            status: Status.ACTIVE,
          };
          this.service.client.createIncidentMobile(request, (err, resp) => {
            if (err) {
              if (err.details) {
                return reject(new Error(err.details));
              }
              return reject(err);
            }
            resolve(resp);
          });
        },
      );

      if (response.ok && response.incident) {
        const incident = response.incident;
        this.incidentNotification.sendNotificatonCreatedIncident(
          user_id,
          incident.latitude,
          incident.longitude,
          2,
        );
        return this.responseExpress.successResponse(res, response.incident);
      }
      throw new Error(response.message);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

}

export default CreateIncidentMobileController;
