import { Request, Response } from "express";
import ResponseExpress from "../../../common/adapters/responseExpressAdapter";
import { GetIncidentNotificationService } from "../domain/services/getIncidentNotification.service";

class GetIncidentNotificationController {
  async handler(req: Request, res: Response) {
    const responseExpress = new ResponseExpress();

    try {
      const { body } = req;
      const { sort, limit, skip, userId } = body;
      const service = new GetIncidentNotificationService();
      const result = await service.getIncidentsNotificationByUser(
        sort,
        limit,
        skip,
        userId,
      );

      return responseExpress.successResponse(res, result);
    } catch (error) {
      return responseExpress.errorResponse(res, error as Error);
    }
  }
}

export default GetIncidentNotificationController;
