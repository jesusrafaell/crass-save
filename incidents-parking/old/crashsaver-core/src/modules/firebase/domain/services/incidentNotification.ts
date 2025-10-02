import { CloudWatchLogs } from "aws-sdk";
import FcmClient from "../../../../common/adapters/proto/fcmClient";
import { SendMessageFCMRequest } from "../../../../proto/fcm/service";
import calculateDistance from "../../../incident/app/functions/distanceCalculator";
import { DTODataByRadius } from "../../../incident/domain/model/incident";
import { GetLocalizationService } from "../../../localization/domain/services/getLocalization.service";
import { GetUserService } from "../../../user/domain/services/getUser.service";

export class IncidentNotification {
  private service!: FcmClient;
  constructor(
    private readonly getLocalizationservice = new GetLocalizationService(),
    private readonly getUserService = new GetUserService(),
  ) {}

  public async sendNotificatonCreatedIncident(
    userId: string,
    latitude: number,
    longitude: number,
    incidentType: number,
  ) {
    const dataRadius: DTODataByRadius = {
      latitude: latitude,
      longitude: longitude,
      radius: 1000,
    };

    const { localizations } =
      await this.getLocalizationservice.getLocationGeospatialByRadius(
        dataRadius,
      );

    if (!localizations.length) {
      return;
    }

    this.service = new FcmClient();
    for (let last_location of localizations) {
      const { user } = await this.getUserService.getUserById(
        last_location.user_id,
      );
      //condition report incident
      if (
        user &&
        user.fcm_token !== "" &&
        user.status == "activo" &&
        user._id.toString() !== userId //not report same user
      ) {
        //fmc no sended
        const distance = calculateDistance(
          latitude,
          longitude,
          last_location.location.coordinates[1],
          last_location.location.coordinates[0],
        );

        //console.log("send to", user.email, user._id);

        const title =
          incidentType === 1 ? "Nueva Incidencia" : "Nueva Incidencia Movil";

        const metr = `, a ${distance.toFixed(1)} metros.`;

        const message = `${user.first_name.trim()}, se ha creado una nueva incidencia cerca de ti ${
          incidentType === 1 ? metr : ""
        }`;

        const request: SendMessageFCMRequest = {
          fcm: {
            fcmToken: user.fcm_token,
            title,
            message,
            sound: "notification",
          },
        };

        console.log(request);

        this.service.client.sendMessageFcm(request, (err, resp) => {
          if (err) {
            console.log("Error send to", user.email, err);
          }
          //console.log("Sended", user.email, err);
        });
      }
    }
  }
}
