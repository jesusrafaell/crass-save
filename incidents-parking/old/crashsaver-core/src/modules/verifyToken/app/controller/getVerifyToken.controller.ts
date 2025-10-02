import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { TokensService } from "../../domain/services/verifyToken.service";

class GetVerifyTokenController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly tokensService = new TokensService(),
  ) {}

  public validForgotPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      //verify
      await this.tokensService.verifyTokenPassword(token);
      //valid exist
      const result = await this.tokensService.getByToken(
        token,
        "passwordReset",
      );
      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default GetVerifyTokenController;
