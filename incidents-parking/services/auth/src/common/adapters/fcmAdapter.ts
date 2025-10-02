import { credentials } from "@grpc/grpc-js";
import { FCMServiceClient } from "../../proto/fcm/service";
import { log } from "console";

class NotificationClient {
  private server: string;
  public client!: FCMServiceClient;

  constructor() {
    this.server = process.env.NOTIFICATION_SERVER as string;
    this.client = this.newClient();
  }

  private newClient(): FCMServiceClient {
    // console.log("SERVER FCM:", this.server);
    this.server = "localhost:3005";
    // return new FCMServiceClient(server, credentials.createInsecure());
    return new FCMServiceClient(this.server, credentials.createSsl());
  }

  public getServer() {
    return this.server;
  }

  public async close(): Promise<void> {
    if (this.client) {
      this.client.close();
    }
  }
}

export default NotificationClient;
