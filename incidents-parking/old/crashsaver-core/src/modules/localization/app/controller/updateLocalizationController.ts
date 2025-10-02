import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { UpdateLocalizationService } from "../../domain/services/updateLocalization.service";
import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
import { UpdateLocation } from "../../domain/model/localization";
import IncidentMobilesConnector from "../../../incident/infra/connectors/incidentMobileConnector";

class UpdateLocalizationController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly updateLocalizationService = new UpdateLocalizationService(),
    private readonly _incidentMobilesConnector = new IncidentMobilesConnector(),
  ) {}

  public updated = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData;
      const userId = _id.toString();

      const body = req.body as { userLongitude: number, userLatitude: number, incident_id: string}

      const location: UpdateLocation = {
        latitude: body.userLatitude,
        longitude: body.userLongitude,
      }

      await this.updateLocalizationService
        .updateLocalizationByUser(userId, location.latitude, location.longitude)
        .catch(() => {
          throw new Error(listCodeErrors.localizationNotFound.code);
        });

      //existe incident movil
      if(body.incident_id){
        //user send the incident location
        this.updatedIncidentLocation(body.incident_id, location)
      }

      return this.responseExpress.successResponse(res, {
        message: "updated localization",
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  private updatedIncidentLocation = async (incident_id: string, location: UpdateLocation) => {
    try {
      await this._incidentMobilesConnector.updateLocation(incident_id, location);
    } catch (err) {
      console.log(`UpdateLocalizationController (updatedIncidentLocation) ${incident_id}`, err)
    }
  };

}

export default UpdateLocalizationController;
