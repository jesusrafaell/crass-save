import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { LogoutService } from "../../domain/services/logout.services";
import { DtoToken } from "../../../verifyToken/domain/model/token";

class LogoutController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly logoutService = new LogoutService(),
  ) {}

  public handler = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const userId = _id.toString();
      await this.logoutService.logout(userId);
      return this.responseExpress.successResponse(res, {
        message: "User logout",
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default LogoutController;
