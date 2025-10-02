import { Request, Response } from "express";
import ResponseExpress from "../../../../../common/adapters/responseExpressAdapter";
import IncidentsClient from "../../../../../common/adapters/proto/incidentsClient";
import {
  GetIncidentsRequest,
  IncidentIdRequest,
  IncidentMobile,
  IncidentMobileResponse,
  IncidentsMobileResponse,
} from "../../../../../proto/incident/service";

 class GetIncidentMobileController {
  private service!: IncidentsClient;
  constructor(
    private readonly responseExpress = new ResponseExpress(),
  ) { }

  public getMobilesIncidents = async (_: Request, res: Response) => {
    try {
      const request: GetIncidentsRequest= {}

      const responseMobile: IncidentsMobileResponse = await new Promise((resolve, reject) => {
        this.service = new IncidentsClient()
        this.service.client.getIncidentsMobile(request, (err, resp) => {
          if (err) {
            if (err.details) {
              return reject(new Error(err.details));
            }
            return reject(err);
          }
          resolve(resp);
        })
       })


      const result = {
        incidentsMobiles: responseMobile.incidents
      }

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  //by id
  public getMobileIncident = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const request: IncidentIdRequest = {
        id
      };

      const responseMobile: IncidentMobileResponse = await new Promise((resolve, reject) => {
        this.service = new IncidentsClient()
        this.service.client.getIncidentMobile(request, (err, resp) => {
          if (err) {
            if (err.details) {
              return reject(new Error(err.details));
            }
            return reject(err);
          }
          resolve(resp);
        })
       })

      const result = {
        incident: responseMobile.incident,
      }

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default GetIncidentMobileController;
