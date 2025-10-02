import { Request, Response } from "express";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { DeleteUserService } from "../../domain/services/deleteUser.service";

class DeleteUserController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly deleteUserService = new DeleteUserService(),
  ) {}

  public deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const result = await this.deleteUserService.deleteUser(userId);

      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default DeleteUserController;
