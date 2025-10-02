import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { Request, Response } from "express";
import { GuestDto, RegisterUser } from "../../../user/domain/model/user";
import { CreateAccountService } from "../../domain/services/createAccount.service";

class SignupController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly createAccountService = new CreateAccountService(),
  ) {}

  public hander = async (req: Request, res: Response) => {
    try {
      const user = req.body as RegisterUser;

      await this.createAccountService.createAccount(user);

      return this.responseExpress.successResponse(res, {
        message: "User registed successly",
      });
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default SignupController;
