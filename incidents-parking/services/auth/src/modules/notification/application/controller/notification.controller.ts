import { FastifyReply, FastifyRequest } from "fastify";
import ResponseFastifyAdapter from "../../../../common/adapters/responseFastifyAdapter";
import { NotificationService } from "../../domain/services/notification.service";
import {
  NotificationUser,
  NotificationUserInRadius,
} from "../../domain/model/notificationUserInRadius";

class NotificationController {
  constructor(
    private readonly responseAdapter = new ResponseFastifyAdapter(),
    private readonly notificationService = new NotificationService()
  ) {}

  public notificationUserInRadius = async (
    req: FastifyRequest<{ Body: NotificationUserInRadius }>,
    reply: FastifyReply
  ) => {
    try {
      const notification = req.body;
      const res =
        await this.notificationService.notificationInRadius(notification);
      return this.responseAdapter.successResponse(reply, { notified: res });
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public notificationUser = async (
    req: FastifyRequest<{ Body: NotificationUser }>,
    reply: FastifyReply
  ) => {
    try {
      const res = await this.notificationService.notification(req.body);
      return this.responseAdapter.successResponseMessage(
        reply,
        `${res} Notification Sent`
      );
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };
}

export default NotificationController;
