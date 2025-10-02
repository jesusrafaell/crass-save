const listCodeErrors = {
  userNotFound: {
    code: "R000E",
    desc: "User not found",
  },
  required: {
    code: "R001E",
    desc: "Required field, not provided.",
  },
  string: {
    code: "R002E",
    desc: "The field must be a string.",
  },
  number: {
    code: "R003E",
    desc: "The field must be a numeric value.",
  },
  long: {
    code: "R004E",
    desc: "The field's length does not meet the specified requirements.",
  },
  empty: {
    code: "R005E",
    desc: "The field must not be empty.",
  },
  onlyLetter: {
    code: "R011E",
    desc: "The field must be only letter",
  },
  notAccess: {
    code: "R031E",
    desc: "not authorization",
  },
  parkingNotFound: {
    code: "R001P",
    desc: "parking not found",
  },
  companyNotFound: {
    code: "R002P",
    desc: "company not found",
  },
  bookingNotFound: {
    code: "R003P",
    desc: "booking not found",
  },
  notHaveBooking: {
    code: "R004P",
    desc: "Dont have license plate",
  },
  bookingAsigned: {
    code: "R005P",
    desc: "booking already asigned",
  },
};

export default listCodeErrors;
