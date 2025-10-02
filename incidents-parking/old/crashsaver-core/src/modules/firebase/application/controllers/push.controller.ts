import { Request, Response } from "express";
import { NotificationService } from "../../domain/services/notification.service";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";

class PushController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly notificationService = new NotificationService(),
  ) {}

  public sendNotification = async (req: Request, res: Response) => {
    const { registrationToken, title, body } = req.body;
    try {
      const response = await this.notificationService.sendPushNotification(
        registrationToken,
        title,
        body,
      );
      res.status(200).json(response);
      return this.responseExpress.successResponse(res, response);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public sendNotificationAll = async (req: Request, res: Response) => {
    const { topic, title, body } = req.body;
    try {
      const response = await this.notificationService.sendPushNotificationAll(
        topic,
        title,
        body,
      );
      return this.responseExpress.successResponse(res, response);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default PushController;
