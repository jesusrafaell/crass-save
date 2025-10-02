import { Request, Response } from "express";
import ResponseExpress from "../../../../../common/adapters/responseExpressAdapter";
import { IncidentStatus } from "../../../domain/model/incident";
import IncidentsClient from "../../../../../common/adapters/proto/incidentsClient";
import {  MessageResponse, Status, UpdateIconIncidentRequest, UpdateStatusIncidentRequest } from "../../../../../proto/incident/service";
import listCodeErrors from "../../../../../common/middlewares/listCodeErrors";

class UpdateIncidentController {
  private service!: IncidentsClient;
  constructor(
    private readonly responseExpress = new ResponseExpress(),
  ) {}

  public StaticStatusById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const status = req.body.status as IncidentStatus;

      const newStatus: Status = status

      const response: MessageResponse = await new Promise((resolve, reject) => {
        //service grpc
        this.service = new IncidentsClient()
        const request: UpdateStatusIncidentRequest = { 
          id: id,
          status: newStatus,
        }
        this.service.client.updateStatusIncidentStatic(request, (err, response)  => {
          if (err) {
            if (err.details) {
              if (err.details.includes('not found')) {
                return reject(new Error("R001IE"));
              }
              return reject(new Error(err.details));
            }
            return reject(err);
          }
          resolve(response);
        });
      });

      if (!response.ok) { throw new Error(response.message)}
      return this.responseExpress.successResponse(res, {
        message: `updated status (${status}), ${id}`,
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public StaticIconById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const icon = req.body.icon as number;

      const response: MessageResponse = await new Promise((resolve, reject) => {
        //service grpc
        this.service = new IncidentsClient()
        const request: UpdateIconIncidentRequest = { 
          id: id,
          icon 
        }
        this.service.client.updateIconIncidentStatic(request, (err, response)  => {
          if (err) {
            if (err.details) {
              if (err.details.includes('not found')) {
                return reject(new Error("R001IE"));
              }
              return reject(new Error(err.details));
            }
            return reject(err);
          }
          resolve(response);
        });
      });

      if (!response.ok) { throw new Error(response.message)}
      return this.responseExpress.successResponse(res, {
        message: `updated icon (${icon}), ${id}`,
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public StaticStatusByIdV1 = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const status = req.body.status as string;

      const newStatus: Status = Status[status.toUpperCase()]

      const response: MessageResponse = await new Promise((resolve, reject) => {
        //service grpc
        this.service = new IncidentsClient()
        const request: UpdateStatusIncidentRequest = { 
          id: id,
          status: newStatus,
        }
        this.service.client.updateStatusIncidentStatic(request, (err, response)  => {
          if (err) {
            if (err.details) {
              if (err.details.includes('not found')) {
                return reject(new Error(listCodeErrors.incidentNotFound.code));
              }
              return reject(new Error(listCodeErrors.incidentNotFound.code));
            }
            return reject(err);
          }
          resolve(response);
        });
      });

      if (!response.ok) { throw new Error(response.message)}
      return this.responseExpress.successResponse(res, {
        message: `updated status (${status}), ${id}`,
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default UpdateIncidentController;
