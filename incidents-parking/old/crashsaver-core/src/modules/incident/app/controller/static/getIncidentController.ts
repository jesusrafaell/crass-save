import { Request, Response } from "express";
import ResponseExpress from "../../../../../common/adapters/responseExpressAdapter";
import { DtoToken } from "../../../../verifyToken/domain/model/token";
import { DTODataByRadius } from "../../../domain/model/incident";
import IncidentsClient from "../../../../../common/adapters/proto/incidentsClient";
import { GetIncidentsRequest, GetNearbyIncidentsRequest, GetNearbyIncidentsResponse, IncidentIdRequest, IncidentMobile, IncidentMobileResponse, IncidentStatic, IncidentStaticResponse, IncidentsMobileResponse, IncidentsStaticResponse } from "../../../../../proto/incident/service";
import { DTOResIncidents } from "../../../domain/model/incidentsWithRelations";

 class GetIncidentController {
  private service!: IncidentsClient;
  constructor(
    private readonly responseExpress = new ResponseExpress(),
  ) { }

  public getIncidentsByUser = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const user_id = _id.toString();

      const { userLatitude, userLongitude, radius } = req.body;

      const data: DTODataByRadius = {
        latitude: userLatitude,
        longitude: userLongitude,
        radius,
      };


      const response: GetNearbyIncidentsResponse = await new Promise((resolve, reject) => {
        this.service = new IncidentsClient()
        const request: GetNearbyIncidentsRequest = {
          latitude: data.latitude, 
          longitude: data.longitude,
          userId: user_id,
          radius: data.radius
        };
        this.service.client.getNearbyIncidents(request, (err, resp) => {
          if (err) {
            if (err.details) {
              return reject(new Error(err.details));
            }
            return reject(err);
          }
          resolve(resp);
        })
      })

      if (!response.ok) throw new Error("Error service incident")

      const result = {
        incidents: response.incidents,
        myIncidents: response.myIncidents,
        incidentsMobiles: response.incidentsMobiles,
        myIncidentMobile:response.myIncidentMobile || null, 
      }
      return this.responseExpress.successResponse(res, result)
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public getIncidentsByUserV1 = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const user_id = _id.toString();

      const { userLatitude, userLongitude, radius } = req.body;

      const data: DTODataByRadius = {
        latitude: userLatitude,
        longitude: userLongitude,
        radius,
      };


      const response: GetNearbyIncidentsResponse = await new Promise((resolve, reject) => {
        this.service = new IncidentsClient()
        const request: GetNearbyIncidentsRequest = {
          latitude: data.latitude, 
          longitude: data.longitude,
          userId: user_id,
          radius: data.radius
        };
        this.service.client.getNearbyIncidents(request, (err, resp) => {
          if (err) {
            if (err.details) {
              return reject(new Error(err.details));
            }
            return reject(err);
          }
          resolve(resp);
        })
      })

      if (!response.ok) throw new Error("Error service incident")

      const result = {
        incidents: this.formatIncident(response.incidents),
        my_incidents:  this.formatIncident(response.myIncidents) 
      }
      return this.responseExpress.successResponse(res, result)
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public getAllIncidents = async (_: Request, res: Response) => {
    try {
      const request: GetIncidentsRequest= {}

      const responseStatics: IncidentsStaticResponse = await new Promise((resolve, reject) => {
        this.service = new IncidentsClient()
        this.service.client.getIncidentsStatic(request, (err, resp) => {
          if (err) {
            if (err.details) {
              return reject(new Error(err.details));
            }
            return reject(err);
          }
          resolve(resp);
        })
       })

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
        incidents: responseStatics.incidents,
        incidentsMobiles: responseMobile.incidents
      }

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public getStaticIncidents = async (_: Request, res: Response) => {
    try {
      const request: GetIncidentsRequest= {}

      const responseStatics: IncidentsStaticResponse = await new Promise((resolve, reject) => {
        this.service = new IncidentsClient()
        this.service.client.getIncidentsStatic(request, (err, resp) => {
          if (err) {
            if (err.details) {
              return reject(new Error(err.details));
            }
            return reject(err);
          }
          resolve(resp);
        })
       })

      console.log(responseStatics)

      const result = {
        incidents: responseStatics.incidents,
      }

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  private formatIncident(incidents: IncidentStatic[]): DTOResIncidents[]{
    return incidents.map(i => {
      const incident: DTOResIncidents = {
        _id: i.id,
        description: i.description,
        latitude: i.latitude,
        longitude: i.longitude,
        created_time: i.createdTime,
        status: i.status  === 1 ? "active" : "resolved",
        incident_type_id: "1",
        create_user_id: i.createUserId,
        verify_user: i.verifyUser,
        distance: i.distance,
      } 
      return incident
    })
  }

  //by id
  public getStaticIncident = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const request: IncidentIdRequest = {
        id
      };
      console.log(id)

      const responseStatic: IncidentStaticResponse = await new Promise((resolve, reject) => {
        this.service = new IncidentsClient()
        this.service.client.getIncidentStatic(request, (err, resp) => {
          if (err) {
            if (err.details) {
              return reject(new Error(err.details));
            }
            return reject(err);
          }
          resolve(resp);
        })
       })

       console.log(responseStatic)
      const result = {
        incident: responseStatic.incident,
      }

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default GetIncidentController;
