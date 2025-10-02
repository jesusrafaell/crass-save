import { JSONSchemaType } from "ajv";
import { VerifyIncident } from "./verifyIncidents";

export const VerifyIncidentSchema: JSONSchemaType<VerifyIncident> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  required: [
    "user_id",
    "incident_id",
    "option",
    "created_time",
    "updated_time",
  ],
  properties: {
    incident_id: { type: "string" },
    user_id: { type: "string" },
    option: { type: "number", enum: [1, 2, 3] },
    created_time: { type: "number" },
    updated_time: { type: "number" },
  },
};
