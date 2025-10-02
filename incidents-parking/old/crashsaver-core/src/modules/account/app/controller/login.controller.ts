import { Request, Response } from "express";
import { GuestDto, Login, LoginTruck } from "../../../user/domain/model/user";
import ResponseExpress from "../../../../common/adapters/responseExpressAdapter";
import { LoginService } from "../../domain/services/login.services";
import { LoginGuestService } from "../../domain/services/loginGuest.services";

class LoginController {
  constructor(
    private readonly responseExpress = new ResponseExpress(),
    private readonly loginService = new LoginService(),
    private readonly loginQuestService = new LoginGuestService(),
  ) {}

  public handler = async (req: Request, res: Response) => {
    try {
      const { email, password, so } = req.body as Login;
      const result = await this.loginService.login(email, password, so);
      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public manager = async (req: Request, res: Response) => {
    try {
      const { email, password, so } = req.body as Login;
      const result = await this.loginService.loginManager(email, password, so);
      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public guest = async (req: Request, res: Response) => {
    try {
      const guest = req.body as GuestDto;
      const result = await this.loginQuestService.login(guest);
      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };

  public truck = async (req: Request, res: Response) => {
    try {
      const truck = req.body as LoginTruck;
      const result = await this.loginService.loginTruck(truck);
      return this.responseExpress.successResponse(res, result);
    } catch (error) {
      return this.responseExpress.errorResponse(res, error as Error);
    }
  };
}

export default LoginController;
