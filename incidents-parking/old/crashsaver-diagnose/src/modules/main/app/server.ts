// Librerias
import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import dotenvFlow from "dotenv-flow";
import helmet from "helmet";
import morgan from "morgan";
import fileUpload from "express-fileupload";

// Rutas
import { PhotoRoutes } from "../../photo/infra/http/apiPhoto.routes";

// Configuraciones
dotenvFlow.config({
  silent: true,
});

class Server {
  private port: number;
  public static instance: Server;
  public app: Application;

  // private authToken = new AuthToken();
  private apiPath = {
    // photos: "/v1/api/photos",
    photos: "/photos",
  };

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
      this.middlewares();
      this.routes();
      this.listen();
    } catch (error) {
      const _error = error as Error;
      console.error(`\x1b[31m${_error.message}\x1b[0m`);
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
    // this.app.use(this.authToken.authToken);
  }

  private routes(): void {
    this.app.use(this.apiPath.photos, PhotoRoutes.routes);
  }

  private listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server run on port ${this.port}`);
    });
  }
}

export default Server;
