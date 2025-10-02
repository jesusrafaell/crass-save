import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { DeleteLocalizationService } from "../../domain/services/deleteLocalization.service";
import { GetLocalizationService } from "../../domain/services/getLocalization.service";

class DeleteLocalizationController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly deleteService = new DeleteLocalizationService(),
    private readonly getService = new GetLocalizationService(),
  ) {}

  public handler = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const localizationFounded = await this.getService.getLocalizationByUserId(
        userId,
      );
      const result = await this.deleteService.deleteLocalization(
        localizationFounded._id.toString(),
      );

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default DeleteLocalizationController;
