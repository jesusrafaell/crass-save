import { FastifyInstance } from "fastify";
import NotificationController from "../../application/controller/notification.controller";
import {
  UserInRadiusValidator,
  UserValidator,
} from "../../../../common/validator/notification/userInRadius";

export class NotificationRoutes {
  static routes = async (fastify: FastifyInstance) => {
    const notificationUser = new NotificationController();

    fastify.post(
      "/user-radius",
      { schema: UserInRadiusValidator },
      notificationUser.notificationUserInRadius
    );

    fastify.post(
      "/user",
      { schema: UserValidator },
      notificationUser.notificationUser
    );
  };
}
