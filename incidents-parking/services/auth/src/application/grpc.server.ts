import * as grpc from "@grpc/grpc-js";
import { AuthUserService } from "../modules/authToken/domain/services/authUser.service";
import { AuthServiceService } from "../proto/auth/service";
import { MongoConnection } from "../common/db/config/configMongo";
import { SessionService } from "../modules/session/domain/services/session.service";

export class GRPCServer {
  private server: grpc.Server;
  private port: string;

  constructor(port: string) {
    this.port = port || "5051";
    this.server = new grpc.Server();
  }

  private addService(service: AuthUserService) {
    this.server.addService(AuthServiceService, {
      session: service.session,
      verifyToken: service.verifyToken,
      getUser: service.getUser,
    } as grpc.UntypedServiceImplementation);
  }

  public async start() {
    try {
      await new MongoConnection().connectionMongo();
      const authService = new AuthUserService();
      this.addService(authService);
      this.server.bindAsync(
        `0.0.0.0:${this.port}`,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            console.error("Server error:", error);
            return;
          }
          console.log(`Server grpc running on port ${port}`);
          this.server.start();
        }
      );
    } catch (error) {
      console.log(error);
      process.exit();
    }
  }
}
