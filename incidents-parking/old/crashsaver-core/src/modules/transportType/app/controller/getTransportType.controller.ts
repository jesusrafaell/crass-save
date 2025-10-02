import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { TransportTypeService } from "../../domain/services/transportType.service";

class TransportTypeController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly transportTypeService = new TransportTypeService(),
  ) {}

  public getTransportTypes = async (_: Request, res: Response) => {
    try {
      const listType  = await this.transportTypeService.getAll({ key: 1 }, 100, 0);

      return this.responseExpress.successResponse(res, listType);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

}

export default TransportTypeController;
