import pool from "../common/db/config";
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { CompanyRoutes } from "../infrastructure/http/company.routes";
import { ParkingRoutes } from "../infrastructure/http/parking.routes";
import { BookingRoutes } from "../infrastructure/http/booking.routes";
import { ParkingServicesRoutes } from "../infrastructure/http/parkingServices.routes";
import { StatusRoutes } from "../infrastructure/http/status.routes";
import { ErrorHandlerMiddleware } from "../common/middlewares/errorHandlerMiddleware";
import { RequestTimingMiddleware } from "../common/middlewares/requestTimingMiddleware";
import { LangMiddleware } from "../common/middlewares/langMiddleware";
import { UserIdMiddleware } from "../common/middlewares/userIdMiddleware";

interface Options {
  port?: number;
}

export class Server {
  public readonly app: FastifyInstance = fastify({
    logger: false,
    ajv: {
      customOptions: { allErrors: true },
      plugins: [require("ajv-errors")],
    },
  });
  private readonly port: number;

  constructor(options: Options) {
    const { port = 4000 } = options;
    this.port = port;
    // this.appRoutes(routes);
    // this.app.register(cors, {
    // 	origin: "*",
    // 	methods: ["GET", "POST", "PUT", "DELETE"],
    // 	allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
    // 	// credentials: true,
    // });
    this.appRoutes();
    this.middleware();
  }

  private middleware() {
    new ErrorHandlerMiddleware(this.app).handleErrors();
    new RequestTimingMiddleware(this.app).addRequestTiming();
    new LangMiddleware(this.app).defaultLanguage();
    new UserIdMiddleware(this.app).checkUserId();
  }

  private appRoutes() {
    this.app.register(CompanyRoutes.routes, { prefix: "/company" });
    this.app.register(ParkingRoutes.routes, { prefix: "/parking" });
    this.app.register(ParkingServicesRoutes.routes, { prefix: "/services" });
    this.app.register(BookingRoutes.routes, { prefix: "/booking" });
    this.app.register(StatusRoutes.routes, { prefix: "/status" });
  }

  private async connectDB() {
    await pool
      .connect()
      .then(() => console.log("Conected DB"))
      .catch((error: any) => console.error("Error DB conection:", error));
  }

  public async start() {
    //db test
    await this.connectDB();

    //run
    this.app.listen({ host: "0.0.0.0", port: this.port }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
}
