import { JSONSchemaType } from "ajv";
import { VerifyToken } from "./token";

export const VerifyTokenSchema: JSONSchemaType<VerifyToken> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  additionalProperties: false,
  properties: {
    token: { type: "string" },
    user_id: { type: "string" },
    type: {
      type: "string",
      enum: ["verifyEmail", "passwordReset"],
    },
    created_time: { type: "number" },
    updated_time: { type: "number" },
  },
  required: ["token", "user_id", "created_time", "updated_time"],
  type: "object",
};
