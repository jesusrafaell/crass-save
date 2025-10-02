import { JSONSchemaType } from "ajv";
import { CoordinatesDto } from "./Coordinates";

export const CoordinatesDtoSchema: JSONSchemaType<CoordinatesDto> = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["Point"] },
    coordinates: {
      type: "array",
      items: [
        { type: "number" }, // lontiude
        { type: "number" }, // latitude
      ],
      minItems: 2,
      maxItems: 2,
    },
  },
  required: ["type", "coordinates"],
  additionalProperties: false,
};
