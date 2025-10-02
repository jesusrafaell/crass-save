import { credentials } from "@grpc/grpc-js";
import { FCMServiceClient } from "../../../proto/fcm/service";

class FcmClient {
  private server = process.env.FCM_SERVER as string;
  public client!: FCMServiceClient;

  constructor() {
    this.newClient();
  }

  private newClient() {
    this.client = new FCMServiceClient(
      this.server,
      credentials.createInsecure(),
    );
  }

  public close() {
    if (this.client) {
      this.client.close();
    }
  }
}

export default FcmClient;
