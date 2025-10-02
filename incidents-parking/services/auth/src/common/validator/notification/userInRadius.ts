import listCodeErrors from "../../utils/listCodeErrors";

export const UserInRadiusValidator = {
  body: {
    type: "object",
    required: ["latitude", "longitude", "radius", "title", "message", "sound"],
    properties: {
      latitude: {
        type: "number",
        minimum: -90,
        maximum: 90,
        errorMessage: listCodeErrors.outOfRange.code,
      },
      longitude: {
        type: "number",
        minimum: -180,
        maximum: 180,
        errorMessage: listCodeErrors.outOfRange.code,
      },
      radius: {
        type: "number",
        minimum: 1,
        maximum: 5000,
        errorMessage: listCodeErrors.numeric.code,
      },
      title: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      message: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      sound: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      userId: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: listCodeErrors.empty.code,
    body: {
      required: listCodeErrors.empty.code,
    },
  },
};

export const UserValidator = {
  body: {
    type: "object",
    required: ["title", "message", "sound", "userId"],
    properties: {
      title: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      message: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      sound: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      userId: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: listCodeErrors.empty.code,
    body: {
      required: listCodeErrors.empty.code,
    },
  },
};
