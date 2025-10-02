import { Request, Response } from "express";
import { DtoToken } from "../../../verifyToken/domain/model/token";
import bcrypt from "bcrypt";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
import { GetUserService } from "../../../user/domain/services/getUser.service";
import { UpdateUserService } from "../../../user/domain/services/udpateUser.service";

class UpdateAccountController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly getUserService = new GetUserService(),
    private readonly updateUserService = new UpdateUserService(),
  ) {}

  public changePassword = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const user_id = _id.toString();
      const newPassword: string = req.body.newPassword;
      const user = await this.getUserService.getUserById(user_id);

      if (!user) throw new Error(listCodeErrors.userNotFound.code);

      // password is the same
      const isPasswordValid = await bcrypt.compare(
        newPassword,
        user.user.password,
      );
      if (!isPasswordValid) {
        await this.updateUserService.changePassword(user_id, newPassword);
        return this.responseExpress.successResponse(res, {
          message: "Password updated successfully",
        });
      } else {
        throw new Error(listCodeErrors.PasswordIsSame.code);
      }
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public updateTransportType = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const user_id = _id.toString();
      const transportType: number = req.body.transportType;
      console.log(user_id, transportType)
      await this.updateUserService.updateUser(user_id, {
          transport_type: transportType
      });
      return this.responseExpress.successResponse(res, {
        message: "TransportType updated successfully",
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default UpdateAccountController;
