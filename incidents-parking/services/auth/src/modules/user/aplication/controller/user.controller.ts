import { FastifyReply, FastifyRequest } from "fastify";
import ResponseFastifyAdapter from "../../../../common/adapters/responseFastifyAdapter";
import { UserUpdate } from "../../domain/models/user";
import { UserService } from "../../domain/services/user.services";
import { NewUserDTO } from "../../../account/domain/models/auth";
import listCodeErrors from "../../../../common/utils/listCodeErrors";
import { getLangEmailVerifyMessage } from "../../../../common/utils/messages";

class UserController {
  constructor(
    private readonly responseAdapter = new ResponseFastifyAdapter(),
    private readonly userService = new UserService()
  ) {}

  public create = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = req.body as NewUserDTO;
      const res = await this.userService.create(user);

      return this.responseAdapter.successCreatedResponse(reply, { id: res.id });
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getTruckersByCompanyId = async (
    req: FastifyRequest<{ Params: { companyId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { companyId } = req.params;
      const res = await this.userService.getTruckersByCompanyId(companyId);
      return this.responseAdapter.successResponse(reply, res);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public addTruck = async (
    req: FastifyRequest<{ Body: { email: string; companyId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const lang = req.headers["lang"] as "es" | "en" | "fr";
      const { email, companyId } = req.body;
      const token = await this.userService.addTruck(lang, email, companyId);
      return this.responseAdapter.successResponse(reply, {
        token,
        message: getLangEmailVerifyMessage(email, lang),
      });
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public verifyTruck = async (
    req: FastifyRequest<{
      Body: { token: string };
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { token } = req.body;
      await this.userService.verifyTruck(token);
      return this.responseAdapter.successCreatedResponse(reply);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getAll = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await this.userService.getAll();

      return this.responseAdapter.successResponse(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getByLicensePlate = async (
    req: FastifyRequest<{ Querystring: { licensePlate: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { licensePlate } = req.query;
      if (!licensePlate)
        throw new Error(listCodeErrors.licensePlateRequired.code);

      const result = await this.userService.getByLicensePlate(licensePlate);

      return this.responseAdapter.successResponse(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getUserById = async (
    req: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id_user = req.params.userId;
      const result = await this.userService.getById(id_user);
      return this.responseAdapter.successResponse(reply, {
        ...result,
        ok: true,
      });
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public getUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.headers["userId"] as string;
      const role = req.headers["role"] as string;
      const result = await this.userService.getUser(userId, role);

      return this.responseAdapter.successResponse(reply, result);
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public updateFcmToken = async (
    req: FastifyRequest<{ Body: { userId: string; fcm_token: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = req.headers["userId"] as string;

      const { fcm_token } = req.body;

      await this.userService.updateFCMToken(fcm_token, userId);

      return this.responseAdapter.successResponseMessage(
        reply,
        "user fcm updated"
      );
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public updateUserById = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UserUpdate }>,
    reply: FastifyReply
  ) => {
    try {
      const user = req.body as UserUpdate;
      user.id = req.params.id;

      await this.userService.updateUser(user);

      return this.responseAdapter.successResponse(reply, {
        message: "user updated",
      });
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public deleteUser = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = req.params.id;

      await this.userService.deleteDataUser(userId);

      return this.responseAdapter.successResponseMessage(reply, "user deleted");
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };
}

export default UserController;
