import { FastifyInstance } from "fastify";
import EmailController from "../../application/email.controller";

export class EmailRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const emailController = new EmailController();
    fastify.post("/send", emailController.SendEmail);
  };
}
