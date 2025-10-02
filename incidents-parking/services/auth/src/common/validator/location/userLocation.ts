import listCodeErrors from "../../utils/listCodeErrors";

export const userLocationValidator = {
  body: {
    type: "object",
    required: ["userLatitude", "userLongitude"],
    properties: {
      userLatitude: {
        type: "number",
        minimum: -90,
        maximum: 90,
        errorMessage: listCodeErrors.outOfRange.code,
      },
      userLongitude: {
        type: "number",
        minimum: -180,
        maximum: 180,
        errorMessage: listCodeErrors.outOfRange.code,
      },
      incident_id: {
        type: "string",
        errorMessage: listCodeErrors.numeric.code,
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: listCodeErrors.empty.code,
  },
};
