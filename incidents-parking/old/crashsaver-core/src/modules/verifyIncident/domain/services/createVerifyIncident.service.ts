// import { MomentAdapter } from "../../../../common/adapters/momentAdapter";
// import { SchemaValidatorAdapter } from "../../../../common/adapters/schemaValidatorAdapter";
// import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
// import { IncidentStaticConnector } from "../../../incident/infra/connectors/incidentStaticConnector";
// import { GetUserService } from "../../../user/domain/services/getUser.service";
// import { VerifyIncidentConnector } from "../../infra/connectors/daoVerifyIncidentConnector";
// import { VerifyIncident } from "../model/verifyIncidents";
// import { VerifyIncidentSchema } from "../model/verifyIncidentsSchema";
// import { GetVerifyIncidentService } from "./getVerifyIncident.service";

// export class CreateVerifyIncidentService {
//   private verifyIncident!: VerifyIncident;
//   private momentAdapter!: MomentAdapter;

//   constructor(
//     private readonly schemaValidatorAdapter = new SchemaValidatorAdapter(),
//     private readonly getUserService = new GetUserService(),
//     private readonly getVerifyIncidentService = new GetVerifyIncidentService(),
//     private readonly verifyIncidentConnector = new VerifyIncidentConnector(),
//     private readonly _incidentStaticConnector =  new IncidentStaticConnector()
//   ) {}

//   public async createVerifyIncident(data: VerifyIncident, userId: string) {
//     try {
//       //valid incident
//       // await this.getIncidentService.getIncident(data.incident_id);

//       //valid user
//       const { user } = await this.getUserService.getUserById(userId);

//       //valid no previus
//       //valid 1 for user
//       const exist = await this.getVerifyIncidentService.validVerifyIncident(
//         data.incident_id,
//         userId,
//       );

//       if (exist) {
//         throw new Error(listCodeErrors.verifyIncidentExist.code);
//       }

//       const localUTC = user.utc;
//       this.momentAdapter = new MomentAdapter(localUTC);

//       this.setVerifyIncident(data, userId);

//       //valid format data
//       this.schemaValidatorAdapter.compileSchema(VerifyIncidentSchema);
//       this.schemaValidatorAdapter.verifySchema(this.verifyIncident);

//       this.verifyIncidentConnector.createVerifyIncident(this.verifyIncident);

//       //param -> len(verifysIncident=false) > 5, resolved incident
//       //paralle
//       this.maxVerifyIncident(data.incident_id);

//       return { verifyIncident: this.verifyIncident };
//     } catch (error) {
//       const _error = error as Error;
//       throw _error;
//     }
//   }

//   private setVerifyIncident(data: VerifyIncident, userId: string) {
//     this.verifyIncident = {
//       incident_id: data.incident_id,
//       user_id: userId,
//       option: data.option,
//       created_time: this.momentAdapter.dateUnix(),
//       updated_time: this.momentAdapter.dateUnix(),
//     };
//   }

//   public async maxVerifyIncident(incident_id: string) {
//     try {
//       const { verifyIncidentList } =
//         await this.getVerifyIncidentService.getVerifyIncidentsByIncident(
//           incident_id,
//         );

//       const cancel =
//         verifyIncidentList.filter((verify) => verify.option === 2).length >= 5;

//       console.log(
//         incident_id,
//         " -> ",
//         verifyIncidentList.filter((verify) => verify.option === 2).length,
//       );

//       if (cancel) {
//         await this._incidentStaticConnector.updateStatus(incident_id, "resolved");
//         console.log("Automatic limit, close incident ->", incident_id);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
