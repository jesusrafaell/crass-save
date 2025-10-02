import { FastifyReply } from "fastify";

class ResponseFastifyAdapter {
  successResponse(reply: FastifyReply, data: any) {
    return reply.code(200).send({ data, ok:true });
  }

  successResponseMessage(reply: FastifyReply, message: string) {
    return reply.code(200).send({ message, ok:true });
  }

  successCreatedResponse(reply: FastifyReply, data?: any) {
    if (!data) {
      return reply.code(201).send({ message: "successfully created", data, ok:true });
    }
    return reply.code(201).send({ message: "successfully created", ok:true });
  }

  errorResponse(reply: FastifyReply, data: Error) {
    const errorMessage = {
      error: data.message,
      name: data.name,
      stack: data?.stack,
      ok: false,
    };

    console.log(errorMessage)

    return reply.code(400).send(errorMessage);
  }

  authErrorResponse(reply: FastifyReply, data: Error) {
    console.log("AuthError:", data);
    return reply.code(401).send({
      error: data.message,
      name: data.name,
      stack: data?.stack,
      ok: false,
    });
  }
}
export default ResponseFastifyAdapter;
