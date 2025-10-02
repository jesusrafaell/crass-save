import { IError, IErrors } from "@/interfaces/auth";

const listCodeErrors: {
  [key: string]: {
    code: string;
    desc: string;
  };
} = {
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
  invalidRequest: { code: "R000V", desc: "invalid request format" },
  insuficientBalance: { code: "R002P", desc: "Insufficient balance" },
  errorServer: { code: "R001V", desc: "error in server" },
  vehicleNotFound: { code: "R002V", desc: "vechile not found" },
  invalidYear: { code: "R003V", desc: "must be > 1700 and <= next year" },
  invalidLicensePlate: {
    code: "R004V",
    desc: "invalid LicensePlate: must be >= 6 alphanumeric characters",
  },
  invalidPolicyNumber: {
    code: "R006V",
    desc: "invalid policy number: must be alphanumeric and >= 3 characters",
  },
  existLicensePlate: { code: "R007V", desc: "LicensePlate already exist" },
  existPolicyNumber: { code: "R008V", desc: "Policy Number already exist" },
  existImagePath: { code: "R010V", desc: "Path Image already exist" },
  brandNotFound: { code: "R011V", desc: "brand not found" },
  modelNotFound: { code: "R012V", desc: "model not found" },
  typeMachineNotFound: { code: "R013V", desc: "typeMachine not found" },
  typeNotFound: { code: "R014V", desc: "type not found" },
  weightNotFound: { code: "R015V", desc: "weight not found" },
  insuranceNotFound: { code: "R016V", desc: "insurance not found" },
  colorNotFound: { code: "R017V", desc: "color not found" },
  towtruckNotFound: { code: "R018V", desc: "tow truck not found" },
  assistRequestFail: { code: "R001A", desc: "assistrequest fail" },
  assistanceNotFound: { code: "R002A", desc: "assistrequest not found" },
  assistanceNotExist: { code: "R002A", desc: "user not have request" }, //duplicado?
  assistRequestAlready: { code: "R003A", desc: "user have assit request" },
  assistanceImagesDuplicate: { code: "R004A", desc: "Images is duplicate" },
  bookingExpired: { code: "R010P", desc: "bookingExpired" },
};

export const mantainanceError = `Service in Maintenance`;

function getErrorDescription(code: string): string | undefined {
  const normalizedCode = code.trim().toUpperCase();
  const errorEntry = Object.values(listCodeErrors).find(
    (entry) => entry.code === normalizedCode
  );
  return errorEntry ? errorEntry.desc : "Service in Maintenance";
}

export const isIError = (obj: any): obj is IError => {
  return (
    obj &&
    typeof obj.error === "string" &&
    typeof obj.name === "string" &&
    typeof obj.stack === "string" &&
    typeof obj.ok === "boolean"
  );
};

// Función de tipo de guardia para IErrors
export const isIErrors = (obj: any): obj is IErrors => {
  const objAux = obj.errors;
  return (
    typeof objAux === "object" &&
    objAux.length &&
    typeof objAux[0].path === "string" &&
    typeof objAux[0].code === "string"
  );
};
export default getErrorDescription;
