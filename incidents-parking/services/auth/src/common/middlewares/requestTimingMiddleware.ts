import { FastifyInstance } from "fastify";

export class RequestTimingMiddleware {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  public addRequestTiming() {
    this.app.addHook("onRequest", (req, reply: any, done) => {
      reply.startTime = Date.now();
      done();
    });

    this.app.addHook("onResponse", (req, reply: any, done) => {
      const durationInMilliseconds = Date.now() - reply.startTime;
      const durationInSeconds = (durationInMilliseconds / 1000).toFixed(2);
      const startTimeDate = new Date(reply.startTime);

      const formattedStartTime =
        startTimeDate.getFullYear() +
        "-" +
        ("0" + (startTimeDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + startTimeDate.getDate()).slice(-2) +
        " " +
        ("0" + startTimeDate.getHours()).slice(-2) +
        ":" +
        ("0" + startTimeDate.getMinutes()).slice(-2);
      console.log(
        `${formattedStartTime} ${req.method} ${req.raw.url} ${reply.raw.statusCode} ${durationInSeconds}s`
      );
      done();
    });
  }
}
