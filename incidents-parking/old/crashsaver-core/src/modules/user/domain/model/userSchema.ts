import { JSONSchemaType } from "ajv";
import { Identification, User, Login } from "./user";

const IdentificationSchema: JSONSchemaType<Identification> = {
  type: "object",
  required: ["type", "image"],
  properties: {
    type: {
      type: "string",
      enum: ["passport", "dni"],
    },
    image: { type: "string" },
  },
};

export const UserSchema: JSONSchemaType<User> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  additionalProperties: false,
  properties: {
    id: {type :"string"},
    first_name: { type: "string" },
    last_name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    mobile: { type: "string" },
    image: { type: "string" },
    status: {
      type: "string",
      enum: ["new", "activo", "inactive", "suspended", "locked"],
      default: "new",
    },
    role: {
      type: "object",
      required: ["_id", "name", "key"],
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        key: { type: "number" },
      },
    },
    distance_radius: { type: "number", default: 1 },
    utc: { type: "string" },
    created_time: { type: "number" },
    updated_time: { type: "number" },
    fcm_token: { type: "string" },
    is_guest: { type: "boolean" },
    transport_type: { type: "number", default: 0 },
  },
  required: [
    "id",
    "first_name",
    "last_name",
    "email",
    "password",
    "mobile",
    "status",
    "role",
    "distance_radius",
    "utc",
    "created_time",
    "updated_time",
    "is_guest",
  ],
  type: "object",
};

export const LoginSchema: JSONSchemaType<Login> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  additionalProperties: false,
  required: ["email", "password", "so"],
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    so: {
      type: "string",
      enum: ["android", "ios", "web"],
    },
  },
  type: "object",
};
