import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { DtoToken } from "../../../verifyToken/domain/model/token";
import { GetUserService } from "../../domain/services/getUser.service";

class GetUserController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly getUserService = new GetUserService(),
  ) {}

  public getUser = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const userId = _id.toString();
      const { user } = await this.getUserService.getUserById(userId);

      const { password,transport_type, ...result } = user;

      return this.responseExpress.successResponse(res, {
        ...result,
        transport: {
          type: transport_type || 0
        },
        udpated_time: user.updated_time,
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public getUserById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const result = await this.getUserService.getUserById(userId);

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const { sort, limit, skip } = body;
      const result = await this.getUserService.getAllUser(sort, limit, skip);

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default GetUserController;
