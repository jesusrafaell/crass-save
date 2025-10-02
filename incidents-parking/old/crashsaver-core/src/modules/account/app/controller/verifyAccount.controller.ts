import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import VerfifyAccountService from "../../domain/services/verifyAccount.service";

class VerfifyAccountController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly verifyAccount = new VerfifyAccountService(),
  ) {}

  public handler = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const { email } = await this.verifyAccount.verifyAccount(token);
      return this.responseExpress.successResponse(res, {
        message: "Verified account",
        email,
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default VerfifyAccountController;
