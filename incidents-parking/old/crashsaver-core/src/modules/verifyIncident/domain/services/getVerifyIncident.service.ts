// import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
// import { VerifyIncidentConnector } from "../../infra/connectors/daoVerifyIncidentConnector";

// export class GetVerifyIncidentService {
//   constructor(
//     private readonly verifyIncidentConnector = new VerifyIncidentConnector(),
//   ) {}

//   public async getVerifyIncident(id: string) {
//     const verifyIncident =
//       await this.verifyIncidentConnector.getVerifyIncidentById(id);

//     if (!verifyIncident) {
//       throw new Error(listCodeErrors.verifyIncidentNotFound.code);
//     }

//     return { verifyIncident };
//   }

//   public async validVerifyIncident(incidentId: string, userId: string) {
//     const verifyIncident =
//       await this.verifyIncidentConnector.getVerifyIncidentUI(
//         incidentId,
//         userId,
//       );

//     return verifyIncident;
//   }

//   public async getVerifyIncidentByUser(userId: string) {
//     const verifyIncidentList =
//       await this.verifyIncidentConnector.getVerifyIncidentsByUser(userId);

//     return { verifyIncidentList };
//   }

//   public async getVerifyIncidentsByIncident(incidentId: string) {
//     const verifyIncidentList =
//       await this.verifyIncidentConnector.getVerifyIncidentsByIncident(
//         incidentId,
//       );

//     return { verifyIncidentList };
//   }
// }
