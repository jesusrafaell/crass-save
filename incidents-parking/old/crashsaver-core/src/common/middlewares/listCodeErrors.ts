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
  numeric: {
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
  leastOneNumeric: {
    code: "R006E",
    desc: "The field must contain at least one numeric character.",
  },
  leastOneAlphabetical: {
    code: "R007E",
    desc: "The field must contain at least one alphabetical character.",
  },
  email: {
    code: "R008E",
    desc: "The field must be a valid email address (e.g., 'email@example.com').",
  },
  password: {
    code: "R009E",
    desc: "The password must be between 8 and 20 characters, contain at least one letter, and at least one number",
  },
  // username: {
  //   code: "R010E",
  //   desc: "The field must be between 6 and 20 characters.",
  // },
  onlyLetter: {
    code: "R011E",
    desc: "The field must be only letter",
  },
  identification: {
    code: "R012E",
    desc: "Identification must have type and image when provided",
  },
  radius: {
    code: "R013E",
    desc: "The radio should be in the range of 50 to 1000",
  },
  emailExist: {
    code: "R014E",
    desc: "Email alrady exist",
  },
  // usernameExist: {
  //   code: "R015E",
  //   desc: "Username alrady exist",
  // },
  mobileExist: {
    code: "R016E",
    desc: "Mobile alrady exist",
  },
  invalidToken: {
    code: "R017E",
    desc: "Invalid authorization token",
  },
  notKeyAutohization: {
    code: "R018E",
    desc: "Please provide WWW-Authorization using API Key",
  },
  localizationNotFound: {
    code: "R019E",
    desc: "Localization not found",
  },
  unverifiedAccount: {
    code: "R020E",
    desc: "Unverified Account",
  },
  PasswordIsSame: {
    code: "R021E",
    desc: "The password is the same",
  },
  incidentTypeNotFound: {
    code: "R022E",
    desc: "Incident_type_key not found",
  },
  incidentExist: {
    code: "R023E",
    desc: "There is already an incident in 100 meters",
  },
  incidentNotFound: {
    code: "R024E",
    desc: "Incident not found",
  },
  invalidIdMongo: {
    code: "R025E",
    desc: "The ID must be a  24-character hexadecimal",
  },
  statusIncidentInvalid: {
    code: "R026E",
    desc: `The status field must be "active", "in_progress", or "resolved"`,
  },
  sendEmail: {
    code: "R027E",
    desc: `send mail fail"`,
  },
  roleNotFound: {
    code: "R028E",
    desc: "role not found",
  },
  userLocked: {
    code: "R029E",
    desc: "account locked",
  },
  expiredToken: {
    code: "R030E",
    desc: "token has expired",
  },
  notAccess: {
    code: "R031E",
    desc: "not authorization",
  },
  verifyIncidentNotFound: {
    code: "R032E",
    desc: "verifyIncident not found",
  },
  verifyIncidentExist: {
    code: "R033E",
    desc: "verifyIncident alrady exist",
  },
  transportTypeNotFound: {
    code: "R034E",
    desc: "transportType not found",
  },
  outOfRange: {
    code: "R002LE",
    desc: "Latitude or Longitude is out of range",
  },
};

export default listCodeErrors;
