import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { CreateUserService } from "../../domain/services/createUser.service";
import { GetUserService } from "../../domain/services/getUser.service";
import { RegisterUser } from "../../domain/model/user";

class CreateUserController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly getUserService = new GetUserService(),
    private readonly createUserService = new CreateUserService(),
  ) {}

  public createUser = async (req: Request, res: Response) => {
    try {
      const userData = req.body as RegisterUser;
      const { email, mobile } = userData;
      await this.getUserService.validExistUser(email, mobile);

      const result = await this.createUserService.createUser(userData);

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default CreateUserController;
