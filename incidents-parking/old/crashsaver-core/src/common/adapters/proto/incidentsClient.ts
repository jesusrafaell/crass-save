import { credentials } from '@grpc/grpc-js';
import { IncidentServiceClient } from '../../../proto/incident/service';


class IncidentsClient {

    private serverIncident = process.env.INCIDENT_SERVER as string;
    public client!: IncidentServiceClient;

    constructor() {
        this.newClient()
    }

    private newClient() {
        this.client = new IncidentServiceClient(
            this.serverIncident,
            credentials.createInsecure()
        );
    }

    public close() {
        if (this.client) {
            this.client.close()
        }
    }

}


export default IncidentsClient
