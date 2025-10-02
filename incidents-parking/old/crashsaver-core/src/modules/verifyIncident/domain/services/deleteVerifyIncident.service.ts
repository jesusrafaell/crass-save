// import { VerifyIncidentConnector } from "../../infra/connectors/daoVerifyIncidentConnector";

// export class DeleteVerifyIncidentService {
//   constructor(
//     private readonly verifyIncidentConnector = new VerifyIncidentConnector(),
//   ) {}

//   public async deleteVerifyIncident(id: string) {
//     const verifyIncident =
//       await this.verifyIncidentConnector.deleteVerifyIncident(id);

//     if (!verifyIncident) {
//       throw new Error(
//         `VerifyIncident doesn't exists: ${id}, UserService method deleteUser`,
//       );
//     }
//   }
// }
