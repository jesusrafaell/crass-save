import { Request, Response } from "express";
import ResponseExpress from "../../../../../common/adapters/responseExpressAdapter";
import { DtoToken } from "../../../../verifyToken/domain/model/token";
import { CreateIncidentStatic } from "../../../domain/model/incident";
import {
  CreateIncidentMobileRequest,
  CreateIncidentStatictRequest,
  IncidentMobile,
  IncidentMobileResponse,
  IncidentStatic,
  IncidentStaticResponse,
  Status,
} from "../../../../../proto/incident/service";
import IncidentsClient from "../../../../../common/adapters/proto/incidentsClient";
import { CreateIncidentMobile } from "../../../domain/model/mobileIncident";
import { IncidentNotification } from "../../../../firebase/domain/services/incidentNotification";

class CreateIncidentStaticController {
  private service!: IncidentsClient;
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly incidentNotification = new IncidentNotification(),
  ) {}

  public createIncidentStatic = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const user_id = _id.toString();
      const body = req.body as CreateIncidentStatic;

      const response: IncidentStaticResponse = await new Promise(
        (resolve, reject) => {
          //service grpc
          this.service = new IncidentsClient();
          const request: CreateIncidentStatictRequest = {
            description: body.description,
            latitude: body.latitude,
            longitude: body.longitude,
            incidentTypeId: body.incident_type_id,
            userId: user_id,
            status: Status.ACTIVE,
          };
          this.service.client.createIncidentStatic(request, (err, resp) => {
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
          1,
        );
        return this.responseExpress.successResponse(res, response.incident);
      }
      throw new Error(response.message);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public createIncidentStaticV1 = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const user_id = _id.toString();
      const body = req.body as CreateIncidentStatic;

      const response: IncidentStaticResponse = await new Promise(
        (resolve, reject) => {
          this.service = new IncidentsClient();
          const request: CreateIncidentStatictRequest = {
            description: body.description,
            latitude: body.latitude,
            longitude: body.longitude,
            incidentTypeId: body.incident_type_id,
            userId: user_id,
            status: Status.ACTIVE,
          };
          this.service.client.createIncidentStatic(request, (err, resp) => {
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
          1,
        );
        return this.responseExpress.successResponse(res, {
          _id: incident.id,
          description: incident.description,
          latitude: incident.latitude,
          longitude: incident.longitude,
          status: "active",
          incident_type_id: incident.incidentTypeId,
          user_id: user_id,
          created_time: incident.createdTime,
          updated_time: incident.updatedTime,
        });
      }
      throw new Error(response.message);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default CreateIncidentStaticController;
