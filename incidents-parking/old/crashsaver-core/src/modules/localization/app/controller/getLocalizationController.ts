import { Request, Response } from "express";
import { GetLocalizationService } from "../../domain/services/getLocalization.service";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";

class GetLocalizationController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly getLocalizationService = new GetLocalizationService(),
  ) {}

  public getById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const result = await this.getLocalizationService.getLocalizationByUserId(
        userId,
      );

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default GetLocalizationController;
