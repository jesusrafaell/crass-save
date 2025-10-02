import { JSONSchemaType } from "ajv";
import { Incident } from "./incident";
import { CoordinatesDtoSchema } from "../../../localization/domain/model/CoordinatesSchema";

// export const IncidentSchema: JSONSchemaType<Incident> = {
//   $schema: "http://json-schema.org/draft-07/schema#",
//   type: "object",
//   required: [
//     "description",
//     "latitude",
//     "longitude",
//     "location",
//     "created_time",
//     "updated_time",
//     "status",
//     "incident_type_id",
//     "user_id",
//   ],
//   properties: {
//     _id: { type: "string" },
//     description: { type: "string" },
//     latitude: { type: "number" },
//     longitude: { type: "number" },
//     location: CoordinatesDtoSchema,
//     status: { type: "string", enum: ["active", "in_progress", "resolved"] },
//     image: { type: "string", nullable: true },
//     incident_type_id: { type: "string" },
//     user_id: { type: "string" },
//     created_time: { type: "number" },
//     updated_time: { type: "number" },
//     transport_type: { type: "string", nullable: true },
//   },
// };
