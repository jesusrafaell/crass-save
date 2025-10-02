import { Request, Response } from "express";
import ResponseExpress from "../../../../../common/adapters/responseExpressAdapter";
import { IncidentStatus } from "../../../domain/model/incident";
import IncidentsClient from "../../../../../common/adapters/proto/incidentsClient";
import {  MessageResponse, Status, UpdateIconIncidentRequest, UpdateStatusIncidentRequest } from "../../../../../proto/incident/service";
import listCodeErrors from "../../../../../common/middlewares/listCodeErrors";

class UpdateIncidentMobileController {
  private service!: IncidentsClient;
  constructor(
    private readonly responseExpress = new ResponseExpress(),
  ) {}

  public MobileStatusById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const status = req.body.status as IncidentStatus;

      const response: MessageResponse = await new Promise((resolve, reject) => {
        this.service = new IncidentsClient()
        const newStatus: Status = status
        const request: UpdateStatusIncidentRequest = { 
          id: id,
          status: newStatus,
        }
        this.service.client.updateStatusIncidentMobile(request, (err, response) => {
          if (err) {
            if (err.details) {
              if (err.details.includes('not found')) {
                return reject(new Error("R001IE"));
              }
            }
            return reject(err);
          }
          resolve(response);
        })
       })

      if (!response.ok) { throw new Error(response.message)}
        return this.responseExpress.successResponse(res, {
          message: `updated status (${status}), ${id}`,
      });

    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
 
}

export default UpdateIncidentMobileController;
