import Server from "./modules/main/app/server";

dotenvFlow.config({
  silent: true,
});

let workers = os.cpus().length;

Server.getInstance();
