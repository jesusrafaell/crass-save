import dotenvFlow from "dotenv-flow";
import { Server } from "./application/server";

dotenvFlow.config({
  silent: true,
});

async function appInstance() {
  new Server({
    port: Number(process.env.PORT),
    env: process.env.ENV || "",
  }).start();
}

appInstance();
