import { FastifyReply, FastifyRequest } from "fastify";
import ResponseFastifyAdapter from "../../../common/adapters/responseFastifyAdapter";
import VerificationEmailService, {
  MailDto,
} from "../domain/services/verificationEmail.service";

class EmailController {
  constructor(
    private readonly responseFastify = new ResponseFastifyAdapter(),
    private readonly email = new VerificationEmailService()
  ) {}

  public SendEmail = async (
    req: FastifyRequest<{ Body: MailDto }>,
    reply: FastifyReply
  ) => {
    try {
      const data: MailDto = req.body;
      const result = await this.email.sendMail(data);
      return this.responseFastify.successResponse(reply, result);
    } catch (error) {
      return this.responseFastify.errorResponse(reply, error as Error);
    }
  };
}

export default EmailController;
