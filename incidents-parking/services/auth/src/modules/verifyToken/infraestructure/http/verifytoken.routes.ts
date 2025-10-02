import { FastifyInstance } from "fastify";
import VerifyTokenController from "../../application/controller/verifyToken.controller";

export class VerifyTokenRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const verifyTokenController = new VerifyTokenController();

    fastify.post("/create-account", verifyTokenController.createTokenAccount);
    fastify.post("/verify-account", verifyTokenController.validAccount);

    fastify.post("/create-driver", verifyTokenController.createTokenDriver);
    fastify.post("/verify-driver", verifyTokenController.validDriver);

    fastify.post("/create-password", verifyTokenController.createTokenPassowrd);
    fastify.post("/change-password", verifyTokenController.validForgotPassword);

    fastify.delete("/:id", verifyTokenController.deleteToken);
  };
}
