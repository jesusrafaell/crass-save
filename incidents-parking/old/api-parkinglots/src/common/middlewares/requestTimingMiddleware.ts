import { FastifyInstance } from "fastify";

export class RequestTimingMiddleware {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  public addRequestTiming() {
    this.app.addHook('onRequest', (req, reply: any, done) => {
      reply.startTime = Date.now();
      done();
    });

    this.app.addHook('onResponse', (req, reply: any, done) => {
      const durationInMilliseconds = Date.now() - reply.startTime;
      const durationInSeconds = (durationInMilliseconds / 1000).toFixed(2);
      console.log(
        `${req.method} ${req.raw.url} ${reply.raw.statusCode} ${durationInSeconds}s`
      );
      done();
    });
  }
}
