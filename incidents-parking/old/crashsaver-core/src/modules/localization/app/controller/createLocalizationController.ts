import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { CreateLocalizationService } from "../../domain/services/createLocalization.service";

class CreateLocalizationController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly createLocalizationService = new CreateLocalizationService(),
  ) {}

  public create = async (req: Request, res: Response) => {
    try {
      const { userId, ...localization } = req.body;
      const result =
        await this.createLocalizationService.createLocalizationByUser(
          localization,
          userId,
        );
      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default CreateLocalizationController;
