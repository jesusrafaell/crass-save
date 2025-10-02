import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { DtoToken } from "../../../verifyToken/domain/model/token";
import { GetUserService } from "../../domain/services/getUser.service";
import { UpdateUserService } from "../../domain/services/udpateUser.service";
import { User } from "../../domain/model/user";

class UpdateUserController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly updateUserService = new UpdateUserService(),
    private readonly getUserService = new GetUserService(),
  ) {}

  public updateUserById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const updatedData = req.body as Partial<User>;
      const result = await this.updateUserService.updateUser(
        userId,
        updatedData,
      );

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const userId = _id.toString();

      const { fcm_token } = req.body;

      //valid user
      await this.getUserService.getUserById(userId);

      const updateUser: Partial<User> = {
        fcm_token,
      };

      //update fcm_token
      await this.updateUserService.updateUser(userId, updateUser);

      return this.responseExpress.successResponse(res, {
        message: "user updated",
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default UpdateUserController;
