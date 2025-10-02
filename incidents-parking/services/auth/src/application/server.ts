import { postgressConnect } from "../common/db/config/configPosgre";
import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import dotenvFlow from "dotenv-flow";
import * as Routes from "../infra/routes";
import { RequestTimingMiddleware } from "../common/middlewares/requestTimingMiddleware";
import { ErrorHandlerMiddleware } from "../common/middlewares/errorHandlerMiddleware";
import { LangMiddleware } from "../common/middlewares/langMiddleware";
import { UserIdMiddleware } from "../common/middlewares/userIdMiddleware";
import { MongoConnection } from "../common/db/config/configMongo";
import { RedisClient } from "../common/db/config/configRedis";

dotenvFlow.config({
  silent: true,
});

interface Options {
  port?: number;
  env: string;
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
    console.log(options.env);
  }

  private middleware() {
    new ErrorHandlerMiddleware(this.app).handleErrors();
    new RequestTimingMiddleware(this.app).addRequestTiming();
    new LangMiddleware(this.app).defaultLanguage();
    new UserIdMiddleware(this.app).checkUserId();
  }

  private appRoutes() {
    this.app.register(Routes.User.routes, { prefix: "/users" });
    this.app.register(Routes.Location.routes, { prefix: "/localization" });
    this.app.register(Routes.Account.routes, { prefix: "/auth" });
    this.app.register(Routes.Status.routes, { prefix: "/status" });
    this.app.register(Routes.Version.routes, { prefix: "/version" });
    this.app.register(Routes.NotificationUser.routes, {
      prefix: "/notification",
    });
    this.app.register(Routes.Email.routes, {
      prefix: "/email",
    });
    this.app.register(Routes.VerifyToken.routes, { prefix: "/verify-token" });
    this.app.register(Routes.Session.routes, { prefix: "/session" });

    //redis
    // this.app.register(Routes.Redis.routes, { prefix: "/redis" });
  }

  private async dbConnection() {
    try {
      await postgressConnect();
      await new MongoConnection().connectionMongo();

      //test redis
      await RedisClient.test();
    } catch (error) {
      console.log(error);
      process.exit();
    }
  }

  public async init() {
    await this.dbConnection();
    this.appRoutes();
    this.middleware();
  }

  public async start() {
    await this.init();
    this.app.listen({ host: "0.0.0.0", port: this.port }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
}
