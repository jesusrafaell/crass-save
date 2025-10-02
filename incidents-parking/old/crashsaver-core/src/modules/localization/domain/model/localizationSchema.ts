import { JSONSchemaType } from "ajv";
import { Localization } from "./localization";
import { CoordinatesDtoSchema } from "./CoordinatesSchema";

export const LocalizationSchema: JSONSchemaType<Localization> = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  required: ["user_latitude", "user_longitude", "last_update", "user_id"],
  properties: {
    _id: { type: "string" },
    user_latitude: { type: "number" },
    user_longitude: { type: "number" },
    location: CoordinatesDtoSchema,
    last_update: { type: "number" },
    user_id: { type: "string" },
  },
};
