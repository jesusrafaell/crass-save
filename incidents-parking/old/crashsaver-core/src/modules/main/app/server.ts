// Librerias
import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import dotenvFlow from "dotenv-flow";
import helmet from "helmet";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import { Observable, catchError, firstValueFrom, of } from "rxjs";

// Dependencias
import MongoReadConnection from "../../../common/config/configMongoReadConnection";
import MongoWriteConnection from "../../../common/config/configMongoWriteConnection";
import PostgreReadConnection from "../../../common/config/configPostgreReadConnection";
import PostgreWriteConnection from "../../../common/config/configPostgreWriteConnection";
import { ParalellQueueAdapter } from "../../../common/adapters/paralellQueueAdapter";

//Middleware
import { AuthToken } from "../../../common/middlewares/authToken";

// Rutas
import { AccountRoutes } from "../../account/infra/http/apiAccount.routes";
import { UserRoutes } from "../../user/infra/http/apiUser.routes";
import { LocalizationRoutes } from "../../localization/infra/http/apiLocalization.routes";
import { IncidentRoutes } from "../../incident/infra/http/apiIncident.routes";
import { FCMPushRoutes } from "../../firebase/infra/http/apiFirabase.routes";
import { VerifyTokenRoutes } from "../../verifyToken/infra/http/apiVerifyToken.routes";
import { VerifyIncidentRoutes } from "../../verifyIncident/infra/http/apiVerifyIncident.routes";
import { IncidentRoutesV1 } from "../../incident/infra/http/apiIncidentv1.routes";
import { DriveAssistRoutes } from "../../driveassist/apiDriveAssist.routes";
import { VersionRoutes } from "../../version/infra/http/apiVersion.routes";
import { ParkingRoutes } from "../../parking/apiParking.routes";
import { PhotoRoutes } from "../../photo/infra/http/apiPhoto.routes";

// Configuraciones
dotenvFlow.config({
  silent: true,
});

class Server {
  private port: number;
  public static instance: Server;
  public app: Application;
  public MongoReadConnection!: MongoReadConnection;
  public MongoWriteConnection!: MongoWriteConnection;
  public PostgreReadConnection!: PostgreReadConnection;
  public PostgreWriteConnection!: PostgreWriteConnection;

  private authToken = new AuthToken();
  private apiPath = {
    //public
    public: "/v1/api/public",
    users: "/v1/api/users",
    auth: "/v1/api/auth",
    verifyToken: "/v1/api/verify-token",
    fcm: "/v1/api/fcm",
    transportTypes: "/v1/api/transporttypes",
    localization: "/v1/api/localization",
    verifyIncidents: "/v1/api/verifyIncidents",
    incidentsV1: "/v1/api/incidents",
    driveAssist: "/v1/api/driveAssist",
    parking: "/v1/api/parking",
    photos: "/v1/api/photos",
    version: "/v1/api/version",
    //v2
    incidents: "/v2/api/incidents",
  };

  private driveAssistRoutes = new DriveAssistRoutes(this.apiPath.driveAssist);
  private parkingRoutes = new ParkingRoutes(this.apiPath.parking);

  private constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3001;
    this.init();
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }

    return Server.instance;
  }

  private async init(): Promise<void> {
    try {
      this.MongoReadConnection = MongoReadConnection.getInstance();
      this.MongoWriteConnection = MongoWriteConnection.getInstance();
      this.PostgreReadConnection = PostgreReadConnection.getInstance();
      this.PostgreWriteConnection = PostgreWriteConnection.getInstance();
      this.listenStatusConnection();
    } catch (error) {
      const _error = error as Error;
      console.error(`\x1b[31m${_error.message}\x1b[0m`);
    }
  }

  private async listenStatusConnection() {
    try {
      const mongoConnections: Observable<boolean | undefined>[] = [];
      mongoConnections.push(
        this.MongoReadConnection.statusConnection.pipe(
          catchError((error) => {
            console.error("Error in MongoDB Read Connection:", error);
            return of(false); // Emitir 'false' en caso de error
          }),
        ),
      );
      mongoConnections.push(
        this.MongoWriteConnection.statusConnection.pipe(
          catchError((error) => {
            console.error("Error in MongoDB Write Connection:", error);
            return of(false); // Emitir 'false' en caso de error
          }),
        ),
      );
      const postgresConnections: Observable<boolean | undefined>[] = [];
      postgresConnections.push(
        this.PostgreReadConnection.statusConnection.pipe(
          catchError((error) => {
            console.error("Error in PostgreSQL Read Connection:", error);
            return of(false); // Emitir 'false' en caso de error
          }),
        ),
      );
      postgresConnections.push(
        this.PostgreWriteConnection.statusConnection.pipe(
          catchError((error) => {
            console.error("Error in PostgreSQL Read Connection:", error);
            return of(false); // Emitir 'false' en caso de error
          }),
        ),
      );

      const allConnections = [...mongoConnections, ...postgresConnections];

      const paralellQueueAdapter = new ParalellQueueAdapter(
        allConnections,
        20,
        20000,
      );

      paralellQueueAdapter.execute();
      await firstValueFrom(paralellQueueAdapter.statusFinishTasks);
      this.middlewares();
      this.routes();
      this.listen();
    } catch (error) {
      throw new Error("Error en la conexión de la db");
    }
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(fileUpload());
    this.app.use(
      express.urlencoded({
        limit: "6mb",
        extended: true,
        parameterLimit: 60000,
      }),
    );
    this.app.use(express.json({ limit: "6mb" }));
    this.app.use(morgan("dev"));
    this.app.use(helmet());
    this.app.use(compression({ level: 9 }));
    this.app.use(this.authToken.authToken);
  }

  private routes(): void {
    this.app.use(this.apiPath.auth, AccountRoutes.routes);
    this.app.use(this.apiPath.users, UserRoutes.routes);
    this.app.use(this.apiPath.localization, LocalizationRoutes.routes);
    this.app.use(this.apiPath.incidentsV1, IncidentRoutesV1.routes);
    this.app.use(this.apiPath.incidents, IncidentRoutes.routes);
    this.app.use(this.apiPath.verifyIncidents, VerifyIncidentRoutes.routes);
    this.app.use(this.apiPath.fcm, FCMPushRoutes.routes);
    this.app.use(this.apiPath.verifyToken, VerifyTokenRoutes.routes);
    this.app.use(this.apiPath.version, VersionRoutes.routes);

    //new
    this.app.use(
      this.apiPath.driveAssist,
      this.driveAssistRoutes.createDriveAssistProxyMiddleware(),
    );

    this.app.use(
      this.apiPath.parking,
      this.parkingRoutes.createParkingProxyMiddleware(),
    );

    this.app.use(this.apiPath.photos, PhotoRoutes.routes);

    // Check if it's alive
    this.app.get(this.apiPath.public + "/live", (req, res) => {
      const message = `Server is live at ${new Date()}`;
      return res.status(200).json({ status: "ok", msg: message });
    });
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en ${this.port}`);
    });
  }
}

export default Server;
