import IncidentsClient from "../../../../common/adapters/proto/incidentsClient";
import { MessageResponse, UpdateIncidentMobileRequest, UpdateStatusIncidentRequest } from "../../../../proto/incident/service";
import { UpdateLocation } from "../../../localization/domain/model/localization";

class IncidentMobilesConnector {
    private service!: IncidentsClient;

    public async updateLocation (id: string, location: UpdateLocation): Promise<MessageResponse> {
        this.service = new IncidentsClient()
        const request: UpdateIncidentMobileRequest  = { 
            id: id,
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
            }
        };
        return new Promise((resolve, reject) => {
            this.service.client.updateIncidentLocationMobile(request, (err, response) => {
                if (err) {
                    if (err.details) {
                        reject(new Error(err.details));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(response);
                }
            });
        });
    }
}

export default IncidentMobilesConnector;

