import { FastifyInstance } from "fastify";
import UserController from "../../aplication/controller/user.controller";
import { fcmTokenValidator } from "../../../../common/validator/user/updateValidator";
import SVCParkingController from "../../aplication/controller/usersvcparking";

export class UserRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const userController = new UserController();
    const svcParkingController = new SVCParkingController();

    fastify.post("/create", userController.create);

    fastify.get("/all", userController.getAll);
    fastify.get("/data", userController.getUser); //mobile and front
    fastify.get("/:userId", userController.getUserById); //web (frontend)
    fastify.get("/truck", userController.getByLicensePlate);

    fastify.put("/:id", userController.updateUserById);

    fastify.put(
      "/fcm_token",
      { schema: fcmTokenValidator },
      userController.updateFcmToken
    );

    fastify.delete("/:id", userController.deleteUser);

    //companyId
    fastify.get(
      "/company/:companyId",
      svcParkingController.getUsersByCompanyId
    );
    fastify.get("/company", svcParkingController.getCompanyByUserId);

    //companyId
    fastify.get("/parking/:parkingId", svcParkingController.getUserByParkingId);
    //get parking by userId
    fastify.get("/parking", svcParkingController.getParkingByUserId);

    //truck
    fastify.get("/truck/all/:companyId", userController.getTruckersByCompanyId);
    fastify.post("/add-truck", userController.addTruck);

    fastify.post("/verify-token/verify-truck", userController.verifyTruck);
  };
}
