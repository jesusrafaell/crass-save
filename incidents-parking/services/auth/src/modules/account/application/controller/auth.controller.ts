import { FastifyReply, FastifyRequest } from "fastify";
import {
  GuestDto,
  Login,
  LoginParking,
  LoginTruck,
} from "../../domain/models/auth";
import ResponseFastifyAdapter from "../../../../common/adapters/responseFastifyAdapter";
import { AuthService } from "../../domain/service/auth/auth.service";
import { AuthTruckService } from "../../domain/service/auth/auth.truck.service";
import { AuthParkingService } from "../../domain/service/auth/auth.parking.service";

class AuthController {
  constructor(
    private readonly responseAdapter = new ResponseFastifyAdapter(),
    private readonly authService = new AuthService(),
    private readonly authTruckService = new AuthTruckService(),
    private readonly authParkingService = new AuthParkingService()
  ) {}

  public loginMobile = async (
    req: FastifyRequest<{ Body: Login }>,
    reply: FastifyReply
  ) => {
    try {
      const { email, password, so } = req.body;
      const result = await this.authService.loginMobile({
        email: email.trim().toLocaleLowerCase(),
        password,
        so,
      });
      return this.responseAdapter.successResponseDirect(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public loginTruck = async (
    req: FastifyRequest<{ Body: LoginTruck }>,
    reply: FastifyReply
  ) => {
    try {
      const { email, password, so, licensePlate } = req.body;

      const result = await this.authTruckService.login({
        email: email.trim().toLocaleLowerCase(),
        password,
        so,
        licensePlate,
      });

      return this.responseAdapter.successResponseDirect(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public loginManger = async (
    req: FastifyRequest<{ Body: Login }>,
    reply: FastifyReply
  ) => {
    try {
      const { email, password, so } = req.body;
      const result = await this.authService.loginManager({
        email: email.trim().toLocaleLowerCase(),
        password,
        so,
      });

      return this.responseAdapter.successResponseDirect(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public loginGuest = async (
    req: FastifyRequest<{ Body: GuestDto }>,
    reply: FastifyReply
  ) => {
    try {
      const guest = req.body;
      const result = await this.authService.loginGuest(guest.utc, guest.so);
      return this.responseAdapter.successResponseDirect(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public logout = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.headers["userId"] as string;
      const role = req.headers["role"] as string;

      await this.authService.logout(userId, role);

      return this.responseAdapter.successResponseMessage(reply, "User logout");
    } catch (err) {
      console.log(err);
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public loginParking = async (
    req: FastifyRequest<{ Body: LoginParking }>,
    reply: FastifyReply
  ) => {
    try {
      const { email, password, so, svc } = req.body;
      const result = await this.authParkingService.login({
        email: email.trim().toLocaleLowerCase(),
        password,
        so,
        svc,
      });

      return this.responseAdapter.successResponseDirect(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };
}

export default AuthController;
