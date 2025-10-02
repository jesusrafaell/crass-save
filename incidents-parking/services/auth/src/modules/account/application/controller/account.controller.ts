import { FastifyReply, FastifyRequest } from "fastify";
import ResponseFastifyAdapter from "../../../../common/adapters/responseFastifyAdapter";
import { NewUserDTO } from "../../domain/models/auth";
import AccountService from "../../domain/service/account.service";

class AccountController {
  constructor(
    private readonly responseAdapter = new ResponseFastifyAdapter(),
    private readonly accountService = new AccountService()
  ) {}

  public createAccount = async (
    req: FastifyRequest<{ Body: NewUserDTO }>,
    reply: FastifyReply
  ) => {
    try {
      await this.accountService.create(req.body);
      // return this.responseAdapter.successResponse(reply, res);
      return this.responseAdapter.successResponseMessage(
        reply,
        "account created"
      );
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public forgotPasswordByEmail = async (
    req: FastifyRequest<{ Body: { email: string } }>,
    reply: FastifyReply
  ) => {
    try {
      await this.accountService.recoverAccountByEmail(req.body.email);
      return this.responseAdapter.successResponseDirect(reply, {
        message: "Mail sended",
      });
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public changePassword = async (
    req: FastifyRequest<{
      Params: { id: string };
      Body: { newPassword: string };
    }>,
    reply: FastifyReply
  ) => {
    try {
      await this.accountService.changePassword(
        req.body.newPassword,
        req.params.id
      );
      return this.responseAdapter.successResponseMessage(
        reply,
        "password updated"
      );
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public changePasswordByEmail = async (
    req: FastifyRequest<{ Body: { password: string; token: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { password, token } = req.body;

      await this.accountService.changePasswordByRecover(password, token);

      return this.responseAdapter.successResponseDirect(reply, {
        message: "password changed success",
      });
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public verifyToken = async (
    req: FastifyRequest<{ Body: { token: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { token } = req.body;

      const { email } = await this.accountService.verifyAccount(token);

      return this.responseAdapter.successResponse(reply, {
        message: "Verified account",
        email,
      });
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  // public changePasswordByEmail = async (req: Request, res: Response) => {
  // 	try {
  // 		const { password, token } = req.body;
  // 		//get user and valid
  // 		await this.recoverAccountService.changePasswordByRecover(password, token);

  // 		return this.responseExpress.successResponse(res, {
  // 			message: 'password changed success',
  // 		});
  // 	} catch (error) {
  // 		return this.responseExpress.errorResponse(res, error as Error);
  // 	}
  // };

  public updateTransportType = async (
    req: FastifyRequest<{ Body: { transportType: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = req.headers["userId"] as string;
      const transportType = req.body.transportType;
      await this.accountService.updateTransportType(userId, transportType);
      return this.responseAdapter.successResponseMessage(
        reply,
        "TransportType updated successfully"
      );
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };

  public delete = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.headers["userId"] as string;

      await this.accountService.delete(userId);

      return this.responseAdapter.successResponseMessage(
        reply,
        "account deleted"
      );
    } catch (err) {
      return this.responseAdapter.errorResponse(reply, err as Error);
    }
  };
}

export default AccountController;
