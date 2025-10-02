// import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
// import { VerifyIncidentConnector } from "../../infra/connectors/daoVerifyIncidentConnector";
// import { VerifyIncident } from "../model/verifyIncidents";

// export class UpdateVerifyIncidentService {
//   constructor(
//     private readonly verifyIncidentConnector = new VerifyIncidentConnector(),
//   ) {}

//   public async updateVerifyIncidentsByIncident(
//     incidentId: string,
//     verifyIncident: Partial<VerifyIncident>,
//   ) {
//     const res = await this.verifyIncidentConnector.updateVerifyIncident(
//       incidentId,
//       verifyIncident,
//     );

//     if (!res) throw new Error(listCodeErrors.verifyIncidentNotFound.code);

//     return { res };
//   }
// }
