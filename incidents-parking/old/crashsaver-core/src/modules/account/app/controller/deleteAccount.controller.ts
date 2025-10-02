import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { Request, Response } from "express";
import { DeleteAccountService } from "../../domain/services/deleteAccount.service";
import { DtoToken } from "../../../verifyToken/domain/model/token";

class DeleteAccountController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly deleteAccountService = new DeleteAccountService(),
  ) {}

  public hander = async (req: Request, res: Response) => {
    try {
      const { _id } = req.body.clientData as DtoToken;
      const userId = _id.toString();

      await this.deleteAccountService.deleteAccount(userId);

      return this.responseExpress.successResponse(res, {
        message: "User Deleted successly",
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default DeleteAccountController;
