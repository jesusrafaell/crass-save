import {
  CreateLocalization,
  CoordinatesData,
  RequestUpdateLocation,
  UpdateLocation,
} from "../../domain/models/location";
import ResponseFastifyAdapter from "../../../../common/adapters/responseFastifyAdapter";
import { FastifyReply, FastifyRequest } from "fastify";
import { LocationService } from "../../domain/services/location.service";
import Validator from "../../../../common/validator";
import { userLocationValidator } from "../../../../common/validator/location/userLocation";

class LocationController {
  constructor(
    private readonly responseFastify = new ResponseFastifyAdapter(),
    private readonly locationService = new LocationService()
  ) {}

  public getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.locationService.getById(req.params.id);
      return this.responseFastify.successResponse(reply, result);
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };

  public getByUserId = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.headers["userId"] as string;
      const result = await this.locationService.getByUserId(userId);

      return this.responseFastify.successResponse(reply, result);
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };

  public getInRadius = async (
    req: FastifyRequest<{ Querystring: CoordinatesData }>,
    reply: FastifyReply
  ) => {
    try {
      const result = await this.locationService.getInRadius(req.query);
      return this.responseFastify.successResponse(reply, result);
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };

  public create = async (
    req: FastifyRequest<{ Body: CreateLocalization }>,
    reply: FastifyReply
  ) => {
    try {
      const localization = req.body;
      const userId = req.headers["userId"] as string;
      const result = await this.locationService.create(localization, userId);
      return this.responseFastify.successResponse(reply, result);
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };

  public updateByUserId = async (
    req: FastifyRequest<{ Body: RequestUpdateLocation }>,
    reply: FastifyReply
  ) => {
    try {
      Validator.validate(userLocationValidator, req.body);
      const userId = req.headers["userId"] as string;

      const body = req.body as {
        userLongitude: number;
        userLatitude: number;
        incident_id: string;
      };

      const location: UpdateLocation = {
        latitude: body.userLatitude,
        longitude: body.userLongitude,
      };

      await this.locationService
        .updateByUser(userId, location.latitude, location.longitude)
        .catch(() => {
          throw new Error("listcode");
        });

      //existe incident movil
      if (body.incident_id) {
        //user send the incident location
        this.IncidentLocation(body.incident_id, location);
      }

      return this.responseFastify.successResponseMessage(
        reply,
        "updated userLocation"
      );
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };

  private IncidentLocation = async (
    incident_id: string,
    location: UpdateLocation
  ) => {
    try {
      // await this._incidentMobilesConnector.updateLocation(incident_id, location);
    } catch (err) {
      console.log(
        `UpdateLocalizationController (IncidentLocation) ${incident_id}`,
        err
      );
    }
  };

  public deleteByUserId = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.headers["userId"] as string;
      await this.locationService.delete(userId).catch(() => {
        throw new Error("listcode");
      });

      return this.responseFastify.successResponse(reply, {
        message: "deleted userLocation",
      });
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };
}

export default LocationController;
