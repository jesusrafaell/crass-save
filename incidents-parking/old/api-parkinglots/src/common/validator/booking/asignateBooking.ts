import listCodeErrors from "../../utils/listCodeErrors";

export const AsignateBookingSchema = {
  body: {
    type: "object",
    required: ["driverId", "licensePlate"],
    properties: {
      licensePlate: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
      //   lpContainer: {
      //     type: "string",
      //     errorMessage: listCodeErrors.string.code,
      //   },
      driverId: {
        type: "string",
        errorMessage: listCodeErrors.string.code,
      },
    },
    additionalProperties: false,
    errorMessage: {
      required: listCodeErrors.empty.code,
    },
  },
};
