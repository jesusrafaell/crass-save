import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import RecoverAccountService from "../../domain/services/recoverAccount.service";

class RecoverAcccountController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly recoverAccountService = new RecoverAccountService(),
  ) {}

  public forgotPasswordByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      //get user and valid
      await this.recoverAccountService.recoverAccountByEmail(email);

      return this.responseExpress.successResponse(res, {
        message: "Mail sended",
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public changePasswordByEmail = async (req: Request, res: Response) => {
    try {
      const { password, token } = req.body;
      //get user and valid
      await this.recoverAccountService.changePasswordByRecover(password, token);

      return this.responseExpress.successResponse(res, {
        message: "password changed success",
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default RecoverAcccountController;
