import { FastifyInstance } from "fastify";

export class LangMiddleware {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  public defaultLanguage() {
    this.app.addHook("preHandler", async (request, _) => {
      const lang = request.headers["lang"];
      if (!lang) {
        request.headers["lang"] = "es";
      } else if (lang !== "en" && lang !== "es" && lang !== "fr") {
        request.headers["lang"] = "es";
      }
    });
  }
}
