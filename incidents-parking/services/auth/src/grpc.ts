import dotenvFlow from "dotenv-flow";
import { GRPCServer } from "./application/grpc.server";

dotenvFlow.config({
  silent: true,
});

async function grpcInstance() {
  const grpc = new GRPCServer(process.env.PORT_GRPC as string);
  await grpc.start();
}

grpcInstance();
