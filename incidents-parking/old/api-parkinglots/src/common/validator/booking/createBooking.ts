import listCodeErrors from "../../utils/listCodeErrors";

export const CreateBookingSchema = {
  body: {
    type: "object",
    required: [
      "description",
      "initTime",
      "endTime",
      "hours",
      "licensePlate",
      "lpContainer",
      "parkingId",
      "companyId",
      "serviceIds",
    ],
    properties: {
      licensePlate: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      lpContainer: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      description: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      initTime: {
        type: "integer",
        errorMessage: listCodeErrors.number.code,
      },
      endTime: {
        type: "integer",
        errorMessage: listCodeErrors.number.code,
      },
      hours: {
        type: "integer",
        errorMessage: listCodeErrors.number.code,
      },
      driverId: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      parkingId: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      serviceIds: {
        type: "array",
        items: {
          type: "string",
        },
        errorMessage: listCodeErrors.required.code,
      },
      companyId: {
        type: "string",
        errorMessage: listCodeErrors.required.code,
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: listCodeErrors.empty.code,
    },
  },
};
