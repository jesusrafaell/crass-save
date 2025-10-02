import { FastifyInstance } from "fastify";

export class ErrorHandlerMiddleware {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  public handleErrors() {
    this.app.setErrorHandler((error, request, reply) => {
      if (error.validation) {
        const errors = error.validation.map((err) => ({
          path: err.instancePath,
          code: err.message,
        }));

        reply.status(400).send({ errors });
      } else {
        reply.send(error);
      }
    });
  }
}
