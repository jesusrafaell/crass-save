import listCodeErrors from "../../utils/listCodeErrors";

export const fcmTokenValidator = {
  body: {
    type: "object",
    required: ["fcm_token"],
    properties: {
      fcm_token: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: listCodeErrors.empty.code,
  },
};

export const updateTransportTypeValidator = {
  body: {
    type: "object",
    required: ["transportType"],
    properties: {
      transportType: {
        type: "number",
        errorMessage: listCodeErrors.numeric.code,
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: listCodeErrors.empty.code,
  },
};
