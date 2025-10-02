import dotenvFlow from "dotenv-flow";
import { Server } from "./application/server";

dotenvFlow.config({
  silent: true,
});

// async function appInstance() {
const server = new Server({ port: Number(process.env.PORT) });
server.start();
// }

// appInstance();

// let workers = os.cpus().length;

// if (cluster.isPrimary) {
//   if (process.env.ENV === "local") {
//     workers = 1;
//   }

//   console.log(`Start cluster with ${workers} workers`);

//   for (let i = 0; i < workers; i++) {
//     const worker = cluster.fork().process;
//     console.log(`worker %s started. ${worker.pid}`);
//   }

//   cluster.on("exit", (worker) => {
//     console.log(`worker %s died. restart... ${worker.process.pid}`);
//     cluster.fork();
//   });
// } else {
// }