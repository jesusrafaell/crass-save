/* eslint-disable */
import { ChannelCredentials, Client, makeGenericClientConstructor, Metadata } from "@grpc/grpc-js";
import type {
  CallOptions,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "incidents";

/** ========================= ENUMERATIONS ========================= */
export enum Status {
  UNKNOWN = 0,
  ACTIVE = 1,
  IN_PROGRESS = 2,
  RESOLVED = 3,
  UNRECOGNIZED = -1,
}

export function statusFromJSON(object: any): Status {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return Status.UNKNOWN;
    case 1:
    case "ACTIVE":
      return Status.ACTIVE;
    case 2:
    case "IN_PROGRESS":
      return Status.IN_PROGRESS;
    case 3:
    case "RESOLVED":
      return Status.RESOLVED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Status.UNRECOGNIZED;
  }
}

export function statusToJSON(object: Status): string {
  switch (object) {
    case Status.UNKNOWN:
      return "UNKNOWN";
    case Status.ACTIVE:
      return "ACTIVE";
    case Status.IN_PROGRESS:
      return "IN_PROGRESS";
    case Status.RESOLVED:
      return "RESOLVED";
    case Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface IncidentStatic {
  id: string;
  latitude: number;
  longitude: number;
  status: Status;
  userId: string;
  description: string;
  incidentTypeId: string;
  distance: number;
  createUserId: string;
  verifyUser: boolean;
  createdTime: number;
  updatedTime: number;
  icon: number;
}

export interface IncidentMobile {
  id: string;
  latitude: number;
  longitude: number;
  status: Status;
  userId: string;
  transportId: string;
  createdTime: number;
  updatedTime: number;
}

/** ========================= TRANSPORT MODELS ========================= */
export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * ========================= REQUESTS & RESPONSES =========================
 * General Requests (only id)
 */
export interface IncidentIdRequest {
  id: string;
}

/** empty */
export interface GetIncidentsRequest {
}

export interface GetNearbyIncidentsRequest {
  latitude: number;
  longitude: number;
  radius: number;
  userId: string;
}

export interface UpdateStatusIncidentRequest {
  id: string;
  status: Status;
}

export interface UpdateIconIncidentRequest {
  id: string;
  icon: number;
}

/** Static Incident */
export interface CreateIncidentStatictRequest {
  latitude: number;
  longitude: number;
  userId: string;
  description: string;
  incidentTypeId: string;
  status: Status;
}

export interface UpdateIncidentStatictRequest {
  id: string;
  incident: IncidentStatic | undefined;
}

export interface IncidentStaticResponse {
  incident: IncidentStatic | undefined;
  ok: boolean;
  message: string;
}

export interface IncidentsStaticResponse {
  incidents: IncidentStatic[];
  ok: boolean;
}

/** Mobile Incident */
export interface CreateIncidentMobileRequest {
  latitude: number;
  longitude: number;
  userId: string;
  transportId: string;
  status: Status;
}

export interface UpdateIncidentMobileRequest {
  id: string;
  location: Location | undefined;
}

export interface IncidentMobileResponse {
  incident: IncidentMobile | undefined;
  ok: boolean;
  message: string;
}

export interface MessageResponse {
  ok: boolean;
  message: string;
}

export interface IncidentsMobileResponse {
  incidents: IncidentMobile[];
  ok: boolean;
}

/** Get Incidents */
export interface GetNearbyIncidentsResponse {
  incidents: IncidentStatic[];
  myIncidents: IncidentStatic[];
  incidentsMobiles: IncidentMobile[];
  myIncidentMobile: IncidentMobile | undefined;
  ok: boolean;
}

/** ========================= Verify Incident  ========================= */
export interface VerfiyIncident {
  id: string;
  incidentId: string;
  userId: string;
  option: number;
  createdTime: number;
  updatedTime: number;
}

export interface CreateVerifyIncidentRequest {
  incidentId: string;
  userId: string;
  option: number;
}

export interface GetVerifyIncidentRequest {
  id: string;
}

export interface VerifyIncidentResponse {
  verify: VerfiyIncident | undefined;
  ok: boolean;
}

export interface VerifysIncidentResponse {
  verifys: VerfiyIncident[];
  ok: boolean;
}

function createBaseIncidentStatic(): IncidentStatic {
  return {
    id: "",
    latitude: 0,
    longitude: 0,
    status: 0,
    userId: "",
    description: "",
    incidentTypeId: "",
    distance: 0,
    createUserId: "",
    verifyUser: false,
    createdTime: 0,
    updatedTime: 0,
    icon: 0,
  };
}

export const IncidentStatic = {
  encode(message: IncidentStatic, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.latitude !== 0) {
      writer.uint32(17).double(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(25).double(message.longitude);
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    if (message.userId !== "") {
      writer.uint32(42).string(message.userId);
    }
    if (message.description !== "") {
      writer.uint32(50).string(message.description);
    }
    if (message.incidentTypeId !== "") {
      writer.uint32(58).string(message.incidentTypeId);
    }
    if (message.distance !== 0) {
      writer.uint32(65).double(message.distance);
    }
    if (message.createUserId !== "") {
      writer.uint32(74).string(message.createUserId);
    }
    if (message.verifyUser === true) {
      writer.uint32(80).bool(message.verifyUser);
    }
    if (message.createdTime !== 0) {
      writer.uint32(88).int64(message.createdTime);
    }
    if (message.updatedTime !== 0) {
      writer.uint32(96).int64(message.updatedTime);
    }
    if (message.icon !== 0) {
      writer.uint32(104).int32(message.icon);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IncidentStatic {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncidentStatic();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.latitude = reader.double();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.longitude = reader.double();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.description = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.incidentTypeId = reader.string();
          continue;
        case 8:
          if (tag !== 65) {
            break;
          }

          message.distance = reader.double();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.createUserId = reader.string();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.verifyUser = reader.bool();
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.createdTime = longToNumber(reader.int64() as Long);
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.updatedTime = longToNumber(reader.int64() as Long);
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.icon = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IncidentStatic {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      latitude: isSet(object.latitude) ? globalThis.Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? globalThis.Number(object.longitude) : 0,
      status: isSet(object.status) ? statusFromJSON(object.status) : 0,
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      incidentTypeId: isSet(object.incidentTypeId) ? globalThis.String(object.incidentTypeId) : "",
      distance: isSet(object.distance) ? globalThis.Number(object.distance) : 0,
      createUserId: isSet(object.createUserId) ? globalThis.String(object.createUserId) : "",
      verifyUser: isSet(object.verifyUser) ? globalThis.Boolean(object.verifyUser) : false,
      createdTime: isSet(object.createdTime) ? globalThis.Number(object.createdTime) : 0,
      updatedTime: isSet(object.updatedTime) ? globalThis.Number(object.updatedTime) : 0,
      icon: isSet(object.icon) ? globalThis.Number(object.icon) : 0,
    };
  },

  toJSON(message: IncidentStatic): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.latitude !== 0) {
      obj.latitude = message.latitude;
    }
    if (message.longitude !== 0) {
      obj.longitude = message.longitude;
    }
    if (message.status !== 0) {
      obj.status = statusToJSON(message.status);
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.incidentTypeId !== "") {
      obj.incidentTypeId = message.incidentTypeId;
    }
    if (message.distance !== 0) {
      obj.distance = message.distance;
    }
    if (message.createUserId !== "") {
      obj.createUserId = message.createUserId;
    }
    if (message.verifyUser === true) {
      obj.verifyUser = message.verifyUser;
    }
    if (message.createdTime !== 0) {
      obj.createdTime = Math.round(message.createdTime);
    }
    if (message.updatedTime !== 0) {
      obj.updatedTime = Math.round(message.updatedTime);
    }
    if (message.icon !== 0) {
      obj.icon = Math.round(message.icon);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IncidentStatic>, I>>(base?: I): IncidentStatic {
    return IncidentStatic.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IncidentStatic>, I>>(object: I): IncidentStatic {
    const message = createBaseIncidentStatic();
    message.id = object.id ?? "";
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    message.status = object.status ?? 0;
    message.userId = object.userId ?? "";
    message.description = object.description ?? "";
    message.incidentTypeId = object.incidentTypeId ?? "";
    message.distance = object.distance ?? 0;
    message.createUserId = object.createUserId ?? "";
    message.verifyUser = object.verifyUser ?? false;
    message.createdTime = object.createdTime ?? 0;
    message.updatedTime = object.updatedTime ?? 0;
    message.icon = object.icon ?? 0;
    return message;
  },
};

function createBaseIncidentMobile(): IncidentMobile {
  return { id: "", latitude: 0, longitude: 0, status: 0, userId: "", transportId: "", createdTime: 0, updatedTime: 0 };
}

export const IncidentMobile = {
  encode(message: IncidentMobile, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.latitude !== 0) {
      writer.uint32(17).double(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(25).double(message.longitude);
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    if (message.userId !== "") {
      writer.uint32(42).string(message.userId);
    }
    if (message.transportId !== "") {
      writer.uint32(50).string(message.transportId);
    }
    if (message.createdTime !== 0) {
      writer.uint32(56).int64(message.createdTime);
    }
    if (message.updatedTime !== 0) {
      writer.uint32(64).int64(message.updatedTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IncidentMobile {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncidentMobile();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.latitude = reader.double();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.longitude = reader.double();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.transportId = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.createdTime = longToNumber(reader.int64() as Long);
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.updatedTime = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IncidentMobile {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      latitude: isSet(object.latitude) ? globalThis.Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? globalThis.Number(object.longitude) : 0,
      status: isSet(object.status) ? statusFromJSON(object.status) : 0,
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      transportId: isSet(object.transportId) ? globalThis.String(object.transportId) : "",
      createdTime: isSet(object.createdTime) ? globalThis.Number(object.createdTime) : 0,
      updatedTime: isSet(object.updatedTime) ? globalThis.Number(object.updatedTime) : 0,
    };
  },

  toJSON(message: IncidentMobile): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.latitude !== 0) {
      obj.latitude = message.latitude;
    }
    if (message.longitude !== 0) {
      obj.longitude = message.longitude;
    }
    if (message.status !== 0) {
      obj.status = statusToJSON(message.status);
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.transportId !== "") {
      obj.transportId = message.transportId;
    }
    if (message.createdTime !== 0) {
      obj.createdTime = Math.round(message.createdTime);
    }
    if (message.updatedTime !== 0) {
      obj.updatedTime = Math.round(message.updatedTime);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IncidentMobile>, I>>(base?: I): IncidentMobile {
    return IncidentMobile.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IncidentMobile>, I>>(object: I): IncidentMobile {
    const message = createBaseIncidentMobile();
    message.id = object.id ?? "";
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    message.status = object.status ?? 0;
    message.userId = object.userId ?? "";
    message.transportId = object.transportId ?? "";
    message.createdTime = object.createdTime ?? 0;
    message.updatedTime = object.updatedTime ?? 0;
    return message;
  },
};

function createBaseLocation(): Location {
  return { latitude: 0, longitude: 0 };
}

export const Location = {
  encode(message: Location, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.latitude !== 0) {
      writer.uint32(9).double(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(17).double(message.longitude);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Location {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLocation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 9) {
            break;
          }

          message.latitude = reader.double();
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.longitude = reader.double();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Location {
    return {
      latitude: isSet(object.latitude) ? globalThis.Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? globalThis.Number(object.longitude) : 0,
    };
  },

  toJSON(message: Location): unknown {
    const obj: any = {};
    if (message.latitude !== 0) {
      obj.latitude = message.latitude;
    }
    if (message.longitude !== 0) {
      obj.longitude = message.longitude;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Location>, I>>(base?: I): Location {
    return Location.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Location>, I>>(object: I): Location {
    const message = createBaseLocation();
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    return message;
  },
};

function createBaseIncidentIdRequest(): IncidentIdRequest {
  return { id: "" };
}

export const IncidentIdRequest = {
  encode(message: IncidentIdRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IncidentIdRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncidentIdRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IncidentIdRequest {
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: IncidentIdRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IncidentIdRequest>, I>>(base?: I): IncidentIdRequest {
    return IncidentIdRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IncidentIdRequest>, I>>(object: I): IncidentIdRequest {
    const message = createBaseIncidentIdRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetIncidentsRequest(): GetIncidentsRequest {
  return {};
}

export const GetIncidentsRequest = {
  encode(_: GetIncidentsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetIncidentsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetIncidentsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): GetIncidentsRequest {
    return {};
  },

  toJSON(_: GetIncidentsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetIncidentsRequest>, I>>(base?: I): GetIncidentsRequest {
    return GetIncidentsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetIncidentsRequest>, I>>(_: I): GetIncidentsRequest {
    const message = createBaseGetIncidentsRequest();
    return message;
  },
};

function createBaseGetNearbyIncidentsRequest(): GetNearbyIncidentsRequest {
  return { latitude: 0, longitude: 0, radius: 0, userId: "" };
}

export const GetNearbyIncidentsRequest = {
  encode(message: GetNearbyIncidentsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.latitude !== 0) {
      writer.uint32(9).double(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(17).double(message.longitude);
    }
    if (message.radius !== 0) {
      writer.uint32(24).int32(message.radius);
    }
    if (message.userId !== "") {
      writer.uint32(34).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetNearbyIncidentsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetNearbyIncidentsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 9) {
            break;
          }

          message.latitude = reader.double();
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.longitude = reader.double();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.radius = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.userId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetNearbyIncidentsRequest {
    return {
      latitude: isSet(object.latitude) ? globalThis.Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? globalThis.Number(object.longitude) : 0,
      radius: isSet(object.radius) ? globalThis.Number(object.radius) : 0,
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
    };
  },

  toJSON(message: GetNearbyIncidentsRequest): unknown {
    const obj: any = {};
    if (message.latitude !== 0) {
      obj.latitude = message.latitude;
    }
    if (message.longitude !== 0) {
      obj.longitude = message.longitude;
    }
    if (message.radius !== 0) {
      obj.radius = Math.round(message.radius);
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetNearbyIncidentsRequest>, I>>(base?: I): GetNearbyIncidentsRequest {
    return GetNearbyIncidentsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetNearbyIncidentsRequest>, I>>(object: I): GetNearbyIncidentsRequest {
    const message = createBaseGetNearbyIncidentsRequest();
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    message.radius = object.radius ?? 0;
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseUpdateStatusIncidentRequest(): UpdateStatusIncidentRequest {
  return { id: "", status: 0 };
}

export const UpdateStatusIncidentRequest = {
  encode(message: UpdateStatusIncidentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.status !== 0) {
      writer.uint32(16).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateStatusIncidentRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateStatusIncidentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateStatusIncidentRequest {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      status: isSet(object.status) ? statusFromJSON(object.status) : 0,
    };
  },

  toJSON(message: UpdateStatusIncidentRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.status !== 0) {
      obj.status = statusToJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateStatusIncidentRequest>, I>>(base?: I): UpdateStatusIncidentRequest {
    return UpdateStatusIncidentRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateStatusIncidentRequest>, I>>(object: I): UpdateStatusIncidentRequest {
    const message = createBaseUpdateStatusIncidentRequest();
    message.id = object.id ?? "";
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseUpdateIconIncidentRequest(): UpdateIconIncidentRequest {
  return { id: "", icon: 0 };
}

export const UpdateIconIncidentRequest = {
  encode(message: UpdateIconIncidentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.icon !== 0) {
      writer.uint32(16).int32(message.icon);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateIconIncidentRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateIconIncidentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.icon = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateIconIncidentRequest {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      icon: isSet(object.icon) ? globalThis.Number(object.icon) : 0,
    };
  },

  toJSON(message: UpdateIconIncidentRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.icon !== 0) {
      obj.icon = Math.round(message.icon);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateIconIncidentRequest>, I>>(base?: I): UpdateIconIncidentRequest {
    return UpdateIconIncidentRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateIconIncidentRequest>, I>>(object: I): UpdateIconIncidentRequest {
    const message = createBaseUpdateIconIncidentRequest();
    message.id = object.id ?? "";
    message.icon = object.icon ?? 0;
    return message;
  },
};

function createBaseCreateIncidentStatictRequest(): CreateIncidentStatictRequest {
  return { latitude: 0, longitude: 0, userId: "", description: "", incidentTypeId: "", status: 0 };
}

export const CreateIncidentStatictRequest = {
  encode(message: CreateIncidentStatictRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.latitude !== 0) {
      writer.uint32(9).double(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(17).double(message.longitude);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.description !== "") {
      writer.uint32(34).string(message.description);
    }
    if (message.incidentTypeId !== "") {
      writer.uint32(42).string(message.incidentTypeId);
    }
    if (message.status !== 0) {
      writer.uint32(48).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateIncidentStatictRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateIncidentStatictRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 9) {
            break;
          }

          message.latitude = reader.double();
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.longitude = reader.double();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.description = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.incidentTypeId = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateIncidentStatictRequest {
    return {
      latitude: isSet(object.latitude) ? globalThis.Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? globalThis.Number(object.longitude) : 0,
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      incidentTypeId: isSet(object.incidentTypeId) ? globalThis.String(object.incidentTypeId) : "",
      status: isSet(object.status) ? statusFromJSON(object.status) : 0,
    };
  },

  toJSON(message: CreateIncidentStatictRequest): unknown {
    const obj: any = {};
    if (message.latitude !== 0) {
      obj.latitude = message.latitude;
    }
    if (message.longitude !== 0) {
      obj.longitude = message.longitude;
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.incidentTypeId !== "") {
      obj.incidentTypeId = message.incidentTypeId;
    }
    if (message.status !== 0) {
      obj.status = statusToJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateIncidentStatictRequest>, I>>(base?: I): CreateIncidentStatictRequest {
    return CreateIncidentStatictRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateIncidentStatictRequest>, I>>(object: I): CreateIncidentStatictRequest {
    const message = createBaseCreateIncidentStatictRequest();
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    message.userId = object.userId ?? "";
    message.description = object.description ?? "";
    message.incidentTypeId = object.incidentTypeId ?? "";
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseUpdateIncidentStatictRequest(): UpdateIncidentStatictRequest {
  return { id: "", incident: undefined };
}

export const UpdateIncidentStatictRequest = {
  encode(message: UpdateIncidentStatictRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.incident !== undefined) {
      IncidentStatic.encode(message.incident, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateIncidentStatictRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateIncidentStatictRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.incident = IncidentStatic.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateIncidentStatictRequest {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      incident: isSet(object.incident) ? IncidentStatic.fromJSON(object.incident) : undefined,
    };
  },

  toJSON(message: UpdateIncidentStatictRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.incident !== undefined) {
      obj.incident = IncidentStatic.toJSON(message.incident);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateIncidentStatictRequest>, I>>(base?: I): UpdateIncidentStatictRequest {
    return UpdateIncidentStatictRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateIncidentStatictRequest>, I>>(object: I): UpdateIncidentStatictRequest {
    const message = createBaseUpdateIncidentStatictRequest();
    message.id = object.id ?? "";
    message.incident = (object.incident !== undefined && object.incident !== null)
      ? IncidentStatic.fromPartial(object.incident)
      : undefined;
    return message;
  },
};

function createBaseIncidentStaticResponse(): IncidentStaticResponse {
  return { incident: undefined, ok: false, message: "" };
}

export const IncidentStaticResponse = {
  encode(message: IncidentStaticResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.incident !== undefined) {
      IncidentStatic.encode(message.incident, writer.uint32(10).fork()).ldelim();
    }
    if (message.ok === true) {
      writer.uint32(16).bool(message.ok);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IncidentStaticResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncidentStaticResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.incident = IncidentStatic.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.ok = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IncidentStaticResponse {
    return {
      incident: isSet(object.incident) ? IncidentStatic.fromJSON(object.incident) : undefined,
      ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
    };
  },

  toJSON(message: IncidentStaticResponse): unknown {
    const obj: any = {};
    if (message.incident !== undefined) {
      obj.incident = IncidentStatic.toJSON(message.incident);
    }
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IncidentStaticResponse>, I>>(base?: I): IncidentStaticResponse {
    return IncidentStaticResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IncidentStaticResponse>, I>>(object: I): IncidentStaticResponse {
    const message = createBaseIncidentStaticResponse();
    message.incident = (object.incident !== undefined && object.incident !== null)
      ? IncidentStatic.fromPartial(object.incident)
      : undefined;
    message.ok = object.ok ?? false;
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseIncidentsStaticResponse(): IncidentsStaticResponse {
  return { incidents: [], ok: false };
}

export const IncidentsStaticResponse = {
  encode(message: IncidentsStaticResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.incidents) {
      IncidentStatic.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.ok === true) {
      writer.uint32(16).bool(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IncidentsStaticResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncidentsStaticResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.incidents.push(IncidentStatic.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.ok = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IncidentsStaticResponse {
    return {
      incidents: globalThis.Array.isArray(object?.incidents)
        ? object.incidents.map((e: any) => IncidentStatic.fromJSON(e))
        : [],
      ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false,
    };
  },

  toJSON(message: IncidentsStaticResponse): unknown {
    const obj: any = {};
    if (message.incidents?.length) {
      obj.incidents = message.incidents.map((e) => IncidentStatic.toJSON(e));
    }
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IncidentsStaticResponse>, I>>(base?: I): IncidentsStaticResponse {
    return IncidentsStaticResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IncidentsStaticResponse>, I>>(object: I): IncidentsStaticResponse {
    const message = createBaseIncidentsStaticResponse();
    message.incidents = object.incidents?.map((e) => IncidentStatic.fromPartial(e)) || [];
    message.ok = object.ok ?? false;
    return message;
  },
};

function createBaseCreateIncidentMobileRequest(): CreateIncidentMobileRequest {
  return { latitude: 0, longitude: 0, userId: "", transportId: "", status: 0 };
}

export const CreateIncidentMobileRequest = {
  encode(message: CreateIncidentMobileRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.latitude !== 0) {
      writer.uint32(9).double(message.latitude);
    }
    if (message.longitude !== 0) {
      writer.uint32(17).double(message.longitude);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.transportId !== "") {
      writer.uint32(34).string(message.transportId);
    }
    if (message.status !== 0) {
      writer.uint32(40).int32(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateIncidentMobileRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateIncidentMobileRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 9) {
            break;
          }

          message.latitude = reader.double();
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }

          message.longitude = reader.double();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.transportId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateIncidentMobileRequest {
    return {
      latitude: isSet(object.latitude) ? globalThis.Number(object.latitude) : 0,
      longitude: isSet(object.longitude) ? globalThis.Number(object.longitude) : 0,
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      transportId: isSet(object.transportId) ? globalThis.String(object.transportId) : "",
      status: isSet(object.status) ? statusFromJSON(object.status) : 0,
    };
  },

  toJSON(message: CreateIncidentMobileRequest): unknown {
    const obj: any = {};
    if (message.latitude !== 0) {
      obj.latitude = message.latitude;
    }
    if (message.longitude !== 0) {
      obj.longitude = message.longitude;
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.transportId !== "") {
      obj.transportId = message.transportId;
    }
    if (message.status !== 0) {
      obj.status = statusToJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateIncidentMobileRequest>, I>>(base?: I): CreateIncidentMobileRequest {
    return CreateIncidentMobileRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateIncidentMobileRequest>, I>>(object: I): CreateIncidentMobileRequest {
    const message = createBaseCreateIncidentMobileRequest();
    message.latitude = object.latitude ?? 0;
    message.longitude = object.longitude ?? 0;
    message.userId = object.userId ?? "";
    message.transportId = object.transportId ?? "";
    message.status = object.status ?? 0;
    return message;
  },
};

function createBaseUpdateIncidentMobileRequest(): UpdateIncidentMobileRequest {
  return { id: "", location: undefined };
}

export const UpdateIncidentMobileRequest = {
  encode(message: UpdateIncidentMobileRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.location !== undefined) {
      Location.encode(message.location, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateIncidentMobileRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateIncidentMobileRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.location = Location.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdateIncidentMobileRequest {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      location: isSet(object.location) ? Location.fromJSON(object.location) : undefined,
    };
  },

  toJSON(message: UpdateIncidentMobileRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.location !== undefined) {
      obj.location = Location.toJSON(message.location);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateIncidentMobileRequest>, I>>(base?: I): UpdateIncidentMobileRequest {
    return UpdateIncidentMobileRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpdateIncidentMobileRequest>, I>>(object: I): UpdateIncidentMobileRequest {
    const message = createBaseUpdateIncidentMobileRequest();
    message.id = object.id ?? "";
    message.location = (object.location !== undefined && object.location !== null)
      ? Location.fromPartial(object.location)
      : undefined;
    return message;
  },
};

function createBaseIncidentMobileResponse(): IncidentMobileResponse {
  return { incident: undefined, ok: false, message: "" };
}

export const IncidentMobileResponse = {
  encode(message: IncidentMobileResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.incident !== undefined) {
      IncidentMobile.encode(message.incident, writer.uint32(10).fork()).ldelim();
    }
    if (message.ok === true) {
      writer.uint32(16).bool(message.ok);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IncidentMobileResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncidentMobileResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.incident = IncidentMobile.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.ok = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IncidentMobileResponse {
    return {
      incident: isSet(object.incident) ? IncidentMobile.fromJSON(object.incident) : undefined,
      ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
    };
  },

  toJSON(message: IncidentMobileResponse): unknown {
    const obj: any = {};
    if (message.incident !== undefined) {
      obj.incident = IncidentMobile.toJSON(message.incident);
    }
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IncidentMobileResponse>, I>>(base?: I): IncidentMobileResponse {
    return IncidentMobileResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IncidentMobileResponse>, I>>(object: I): IncidentMobileResponse {
    const message = createBaseIncidentMobileResponse();
    message.incident = (object.incident !== undefined && object.incident !== null)
      ? IncidentMobile.fromPartial(object.incident)
      : undefined;
    message.ok = object.ok ?? false;
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseMessageResponse(): MessageResponse {
  return { ok: false, message: "" };
}

export const MessageResponse = {
  encode(message: MessageResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ok === true) {
      writer.uint32(8).bool(message.ok);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.ok = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageResponse {
    return {
      ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
    };
  },

  toJSON(message: MessageResponse): unknown {
    const obj: any = {};
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageResponse>, I>>(base?: I): MessageResponse {
    return MessageResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageResponse>, I>>(object: I): MessageResponse {
    const message = createBaseMessageResponse();
    message.ok = object.ok ?? false;
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseIncidentsMobileResponse(): IncidentsMobileResponse {
  return { incidents: [], ok: false };
}

export const IncidentsMobileResponse = {
  encode(message: IncidentsMobileResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.incidents) {
      IncidentMobile.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.ok === true) {
      writer.uint32(16).bool(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IncidentsMobileResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncidentsMobileResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.incidents.push(IncidentMobile.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.ok = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IncidentsMobileResponse {
    return {
      incidents: globalThis.Array.isArray(object?.incidents)
        ? object.incidents.map((e: any) => IncidentMobile.fromJSON(e))
        : [],
      ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false,
    };
  },

  toJSON(message: IncidentsMobileResponse): unknown {
    const obj: any = {};
    if (message.incidents?.length) {
      obj.incidents = message.incidents.map((e) => IncidentMobile.toJSON(e));
    }
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IncidentsMobileResponse>, I>>(base?: I): IncidentsMobileResponse {
    return IncidentsMobileResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IncidentsMobileResponse>, I>>(object: I): IncidentsMobileResponse {
    const message = createBaseIncidentsMobileResponse();
    message.incidents = object.incidents?.map((e) => IncidentMobile.fromPartial(e)) || [];
    message.ok = object.ok ?? false;
    return message;
  },
};

function createBaseGetNearbyIncidentsResponse(): GetNearbyIncidentsResponse {
  return { incidents: [], myIncidents: [], incidentsMobiles: [], myIncidentMobile: undefined, ok: false };
}

export const GetNearbyIncidentsResponse = {
  encode(message: GetNearbyIncidentsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.incidents) {
      IncidentStatic.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.myIncidents) {
      IncidentStatic.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.incidentsMobiles) {
      IncidentMobile.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.myIncidentMobile !== undefined) {
      IncidentMobile.encode(message.myIncidentMobile, writer.uint32(34).fork()).ldelim();
    }
    if (message.ok === true) {
      writer.uint32(40).bool(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetNearbyIncidentsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetNearbyIncidentsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.incidents.push(IncidentStatic.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.myIncidents.push(IncidentStatic.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.incidentsMobiles.push(IncidentMobile.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.myIncidentMobile = IncidentMobile.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.ok = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetNearbyIncidentsResponse {
    return {
      incidents: globalThis.Array.isArray(object?.incidents)
        ? object.incidents.map((e: any) => IncidentStatic.fromJSON(e))
        : [],
      myIncidents: globalThis.Array.isArray(object?.myIncidents)
        ? object.myIncidents.map((e: any) => IncidentStatic.fromJSON(e))
        : [],
      incidentsMobiles: globalThis.Array.isArray(object?.incidentsMobiles)
        ? object.incidentsMobiles.map((e: any) => IncidentMobile.fromJSON(e))
        : [],
      myIncidentMobile: isSet(object.myIncidentMobile) ? IncidentMobile.fromJSON(object.myIncidentMobile) : undefined,
      ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false,
    };
  },

  toJSON(message: GetNearbyIncidentsResponse): unknown {
    const obj: any = {};
    if (message.incidents?.length) {
      obj.incidents = message.incidents.map((e) => IncidentStatic.toJSON(e));
    }
    if (message.myIncidents?.length) {
      obj.myIncidents = message.myIncidents.map((e) => IncidentStatic.toJSON(e));
    }
    if (message.incidentsMobiles?.length) {
      obj.incidentsMobiles = message.incidentsMobiles.map((e) => IncidentMobile.toJSON(e));
    }
    if (message.myIncidentMobile !== undefined) {
      obj.myIncidentMobile = IncidentMobile.toJSON(message.myIncidentMobile);
    }
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetNearbyIncidentsResponse>, I>>(base?: I): GetNearbyIncidentsResponse {
    return GetNearbyIncidentsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetNearbyIncidentsResponse>, I>>(object: I): GetNearbyIncidentsResponse {
    const message = createBaseGetNearbyIncidentsResponse();
    message.incidents = object.incidents?.map((e) => IncidentStatic.fromPartial(e)) || [];
    message.myIncidents = object.myIncidents?.map((e) => IncidentStatic.fromPartial(e)) || [];
    message.incidentsMobiles = object.incidentsMobiles?.map((e) => IncidentMobile.fromPartial(e)) || [];
    message.myIncidentMobile = (object.myIncidentMobile !== undefined && object.myIncidentMobile !== null)
      ? IncidentMobile.fromPartial(object.myIncidentMobile)
      : undefined;
    message.ok = object.ok ?? false;
    return message;
  },
};

function createBaseVerfiyIncident(): VerfiyIncident {
  return { id: "", incidentId: "", userId: "", option: 0, createdTime: 0, updatedTime: 0 };
}

export const VerfiyIncident = {
  encode(message: VerfiyIncident, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.incidentId !== "") {
      writer.uint32(18).string(message.incidentId);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.option !== 0) {
      writer.uint32(32).int32(message.option);
    }
    if (message.createdTime !== 0) {
      writer.uint32(40).int64(message.createdTime);
    }
    if (message.updatedTime !== 0) {
      writer.uint32(48).int64(message.updatedTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerfiyIncident {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerfiyIncident();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.incidentId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.option = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.createdTime = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.updatedTime = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerfiyIncident {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      incidentId: isSet(object.incidentId) ? globalThis.String(object.incidentId) : "",
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      option: isSet(object.option) ? globalThis.Number(object.option) : 0,
      createdTime: isSet(object.createdTime) ? globalThis.Number(object.createdTime) : 0,
      updatedTime: isSet(object.updatedTime) ? globalThis.Number(object.updatedTime) : 0,
    };
  },

  toJSON(message: VerfiyIncident): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.incidentId !== "") {
      obj.incidentId = message.incidentId;
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.option !== 0) {
      obj.option = Math.round(message.option);
    }
    if (message.createdTime !== 0) {
      obj.createdTime = Math.round(message.createdTime);
    }
    if (message.updatedTime !== 0) {
      obj.updatedTime = Math.round(message.updatedTime);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VerfiyIncident>, I>>(base?: I): VerfiyIncident {
    return VerfiyIncident.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VerfiyIncident>, I>>(object: I): VerfiyIncident {
    const message = createBaseVerfiyIncident();
    message.id = object.id ?? "";
    message.incidentId = object.incidentId ?? "";
    message.userId = object.userId ?? "";
    message.option = object.option ?? 0;
    message.createdTime = object.createdTime ?? 0;
    message.updatedTime = object.updatedTime ?? 0;
    return message;
  },
};

function createBaseCreateVerifyIncidentRequest(): CreateVerifyIncidentRequest {
  return { incidentId: "", userId: "", option: 0 };
}

export const CreateVerifyIncidentRequest = {
  encode(message: CreateVerifyIncidentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.incidentId !== "") {
      writer.uint32(10).string(message.incidentId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.option !== 0) {
      writer.uint32(24).int32(message.option);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateVerifyIncidentRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateVerifyIncidentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.incidentId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.option = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateVerifyIncidentRequest {
    return {
      incidentId: isSet(object.incidentId) ? globalThis.String(object.incidentId) : "",
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      option: isSet(object.option) ? globalThis.Number(object.option) : 0,
    };
  },

  toJSON(message: CreateVerifyIncidentRequest): unknown {
    const obj: any = {};
    if (message.incidentId !== "") {
      obj.incidentId = message.incidentId;
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.option !== 0) {
      obj.option = Math.round(message.option);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateVerifyIncidentRequest>, I>>(base?: I): CreateVerifyIncidentRequest {
    return CreateVerifyIncidentRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateVerifyIncidentRequest>, I>>(object: I): CreateVerifyIncidentRequest {
    const message = createBaseCreateVerifyIncidentRequest();
    message.incidentId = object.incidentId ?? "";
    message.userId = object.userId ?? "";
    message.option = object.option ?? 0;
    return message;
  },
};

function createBaseGetVerifyIncidentRequest(): GetVerifyIncidentRequest {
  return { id: "" };
}

export const GetVerifyIncidentRequest = {
  encode(message: GetVerifyIncidentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVerifyIncidentRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVerifyIncidentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetVerifyIncidentRequest {
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: GetVerifyIncidentRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetVerifyIncidentRequest>, I>>(base?: I): GetVerifyIncidentRequest {
    return GetVerifyIncidentRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetVerifyIncidentRequest>, I>>(object: I): GetVerifyIncidentRequest {
    const message = createBaseGetVerifyIncidentRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseVerifyIncidentResponse(): VerifyIncidentResponse {
  return { verify: undefined, ok: false };
}

export const VerifyIncidentResponse = {
  encode(message: VerifyIncidentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.verify !== undefined) {
      VerfiyIncident.encode(message.verify, writer.uint32(10).fork()).ldelim();
    }
    if (message.ok === true) {
      writer.uint32(16).bool(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerifyIncidentResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerifyIncidentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verify = VerfiyIncident.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.ok = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerifyIncidentResponse {
    return {
      verify: isSet(object.verify) ? VerfiyIncident.fromJSON(object.verify) : undefined,
      ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false,
    };
  },

  toJSON(message: VerifyIncidentResponse): unknown {
    const obj: any = {};
    if (message.verify !== undefined) {
      obj.verify = VerfiyIncident.toJSON(message.verify);
    }
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VerifyIncidentResponse>, I>>(base?: I): VerifyIncidentResponse {
    return VerifyIncidentResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VerifyIncidentResponse>, I>>(object: I): VerifyIncidentResponse {
    const message = createBaseVerifyIncidentResponse();
    message.verify = (object.verify !== undefined && object.verify !== null)
      ? VerfiyIncident.fromPartial(object.verify)
      : undefined;
    message.ok = object.ok ?? false;
    return message;
  },
};

function createBaseVerifysIncidentResponse(): VerifysIncidentResponse {
  return { verifys: [], ok: false };
}

export const VerifysIncidentResponse = {
  encode(message: VerifysIncidentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.verifys) {
      VerfiyIncident.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.ok === true) {
      writer.uint32(16).bool(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerifysIncidentResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerifysIncidentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verifys.push(VerfiyIncident.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.ok = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerifysIncidentResponse {
    return {
      verifys: globalThis.Array.isArray(object?.verifys)
        ? object.verifys.map((e: any) => VerfiyIncident.fromJSON(e))
        : [],
      ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false,
    };
  },

  toJSON(message: VerifysIncidentResponse): unknown {
    const obj: any = {};
    if (message.verifys?.length) {
      obj.verifys = message.verifys.map((e) => VerfiyIncident.toJSON(e));
    }
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VerifysIncidentResponse>, I>>(base?: I): VerifysIncidentResponse {
    return VerifysIncidentResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VerifysIncidentResponse>, I>>(object: I): VerifysIncidentResponse {
    const message = createBaseVerifysIncidentResponse();
    message.verifys = object.verifys?.map((e) => VerfiyIncident.fromPartial(e)) || [];
    message.ok = object.ok ?? false;
    return message;
  },
};

/** ========================= SERVICE ========================= */
export type IncidentServiceService = typeof IncidentServiceService;
export const IncidentServiceService = {
  /** Static Incidents */
  createIncidentStatic: {
    path: "/incidents.IncidentService/CreateIncidentStatic",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateIncidentStatictRequest) =>
      Buffer.from(CreateIncidentStatictRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateIncidentStatictRequest.decode(value),
    responseSerialize: (value: IncidentStaticResponse) => Buffer.from(IncidentStaticResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => IncidentStaticResponse.decode(value),
  },
  getIncidentStatic: {
    path: "/incidents.IncidentService/GetIncidentStatic",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: IncidentIdRequest) => Buffer.from(IncidentIdRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => IncidentIdRequest.decode(value),
    responseSerialize: (value: IncidentStaticResponse) => Buffer.from(IncidentStaticResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => IncidentStaticResponse.decode(value),
  },
  getIncidentsStatic: {
    path: "/incidents.IncidentService/GetIncidentsStatic",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetIncidentsRequest) => Buffer.from(GetIncidentsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetIncidentsRequest.decode(value),
    responseSerialize: (value: IncidentsStaticResponse) => Buffer.from(IncidentsStaticResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => IncidentsStaticResponse.decode(value),
  },
  /** udpated */
  updateStatusIncidentStatic: {
    path: "/incidents.IncidentService/UpdateStatusIncidentStatic",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateStatusIncidentRequest) =>
      Buffer.from(UpdateStatusIncidentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateStatusIncidentRequest.decode(value),
    responseSerialize: (value: MessageResponse) => Buffer.from(MessageResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => MessageResponse.decode(value),
  },
  updateIconIncidentStatic: {
    path: "/incidents.IncidentService/UpdateIconIncidentStatic",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateIconIncidentRequest) =>
      Buffer.from(UpdateIconIncidentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateIconIncidentRequest.decode(value),
    responseSerialize: (value: MessageResponse) => Buffer.from(MessageResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => MessageResponse.decode(value),
  },
  /** Mobile Incidents */
  createIncidentMobile: {
    path: "/incidents.IncidentService/CreateIncidentMobile",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateIncidentMobileRequest) =>
      Buffer.from(CreateIncidentMobileRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateIncidentMobileRequest.decode(value),
    responseSerialize: (value: IncidentMobileResponse) => Buffer.from(IncidentMobileResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => IncidentMobileResponse.decode(value),
  },
  getIncidentMobile: {
    path: "/incidents.IncidentService/GetIncidentMobile",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: IncidentIdRequest) => Buffer.from(IncidentIdRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => IncidentIdRequest.decode(value),
    responseSerialize: (value: IncidentMobileResponse) => Buffer.from(IncidentMobileResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => IncidentMobileResponse.decode(value),
  },
  getIncidentsMobile: {
    path: "/incidents.IncidentService/GetIncidentsMobile",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetIncidentsRequest) => Buffer.from(GetIncidentsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetIncidentsRequest.decode(value),
    responseSerialize: (value: IncidentsMobileResponse) => Buffer.from(IncidentsMobileResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => IncidentsMobileResponse.decode(value),
  },
  /** udpated */
  updateIncidentLocationMobile: {
    path: "/incidents.IncidentService/UpdateIncidentLocationMobile",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateIncidentMobileRequest) =>
      Buffer.from(UpdateIncidentMobileRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateIncidentMobileRequest.decode(value),
    responseSerialize: (value: MessageResponse) => Buffer.from(MessageResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => MessageResponse.decode(value),
  },
  updateStatusIncidentMobile: {
    path: "/incidents.IncidentService/UpdateStatusIncidentMobile",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateStatusIncidentRequest) =>
      Buffer.from(UpdateStatusIncidentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateStatusIncidentRequest.decode(value),
    responseSerialize: (value: MessageResponse) => Buffer.from(MessageResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => MessageResponse.decode(value),
  },
  /** Combined */
  getNearbyIncidents: {
    path: "/incidents.IncidentService/GetNearbyIncidents",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetNearbyIncidentsRequest) =>
      Buffer.from(GetNearbyIncidentsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetNearbyIncidentsRequest.decode(value),
    responseSerialize: (value: GetNearbyIncidentsResponse) =>
      Buffer.from(GetNearbyIncidentsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetNearbyIncidentsResponse.decode(value),
  },
  /** verifyIncident (static only) */
  createVerifyIncident: {
    path: "/incidents.IncidentService/CreateVerifyIncident",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateVerifyIncidentRequest) =>
      Buffer.from(CreateVerifyIncidentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateVerifyIncidentRequest.decode(value),
    responseSerialize: (value: VerifyIncidentResponse) => Buffer.from(VerifyIncidentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => VerifyIncidentResponse.decode(value),
  },
  getVerifyIncident: {
    path: "/incidents.IncidentService/GetVerifyIncident",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetVerifyIncidentRequest) => Buffer.from(GetVerifyIncidentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetVerifyIncidentRequest.decode(value),
    responseSerialize: (value: VerifyIncidentResponse) => Buffer.from(VerifyIncidentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => VerifyIncidentResponse.decode(value),
  },
  getVerifysIncidentByUser: {
    path: "/incidents.IncidentService/GetVerifysIncidentByUser",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetVerifyIncidentRequest) => Buffer.from(GetVerifyIncidentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetVerifyIncidentRequest.decode(value),
    responseSerialize: (value: VerifysIncidentResponse) => Buffer.from(VerifysIncidentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => VerifysIncidentResponse.decode(value),
  },
  getVerifysIncidentByIncident: {
    path: "/incidents.IncidentService/GetVerifysIncidentByIncident",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetVerifyIncidentRequest) => Buffer.from(GetVerifyIncidentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetVerifyIncidentRequest.decode(value),
    responseSerialize: (value: VerifysIncidentResponse) => Buffer.from(VerifysIncidentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => VerifysIncidentResponse.decode(value),
  },
} as const;

export interface IncidentServiceServer extends UntypedServiceImplementation {
  /** Static Incidents */
  createIncidentStatic: handleUnaryCall<CreateIncidentStatictRequest, IncidentStaticResponse>;
  getIncidentStatic: handleUnaryCall<IncidentIdRequest, IncidentStaticResponse>;
  getIncidentsStatic: handleUnaryCall<GetIncidentsRequest, IncidentsStaticResponse>;
  /** udpated */
  updateStatusIncidentStatic: handleUnaryCall<UpdateStatusIncidentRequest, MessageResponse>;
  updateIconIncidentStatic: handleUnaryCall<UpdateIconIncidentRequest, MessageResponse>;
  /** Mobile Incidents */
  createIncidentMobile: handleUnaryCall<CreateIncidentMobileRequest, IncidentMobileResponse>;
  getIncidentMobile: handleUnaryCall<IncidentIdRequest, IncidentMobileResponse>;
  getIncidentsMobile: handleUnaryCall<GetIncidentsRequest, IncidentsMobileResponse>;
  /** udpated */
  updateIncidentLocationMobile: handleUnaryCall<UpdateIncidentMobileRequest, MessageResponse>;
  updateStatusIncidentMobile: handleUnaryCall<UpdateStatusIncidentRequest, MessageResponse>;
  /** Combined */
  getNearbyIncidents: handleUnaryCall<GetNearbyIncidentsRequest, GetNearbyIncidentsResponse>;
  /** verifyIncident (static only) */
  createVerifyIncident: handleUnaryCall<CreateVerifyIncidentRequest, VerifyIncidentResponse>;
  getVerifyIncident: handleUnaryCall<GetVerifyIncidentRequest, VerifyIncidentResponse>;
  getVerifysIncidentByUser: handleUnaryCall<GetVerifyIncidentRequest, VerifysIncidentResponse>;
  getVerifysIncidentByIncident: handleUnaryCall<GetVerifyIncidentRequest, VerifysIncidentResponse>;
}

export interface IncidentServiceClient extends Client {
  /** Static Incidents */
  createIncidentStatic(
    request: CreateIncidentStatictRequest,
    callback: (error: ServiceError | null, response: IncidentStaticResponse) => void,
  ): ClientUnaryCall;
  createIncidentStatic(
    request: CreateIncidentStatictRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: IncidentStaticResponse) => void,
  ): ClientUnaryCall;
  createIncidentStatic(
    request: CreateIncidentStatictRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: IncidentStaticResponse) => void,
  ): ClientUnaryCall;
  getIncidentStatic(
    request: IncidentIdRequest,
    callback: (error: ServiceError | null, response: IncidentStaticResponse) => void,
  ): ClientUnaryCall;
  getIncidentStatic(
    request: IncidentIdRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: IncidentStaticResponse) => void,
  ): ClientUnaryCall;
  getIncidentStatic(
    request: IncidentIdRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: IncidentStaticResponse) => void,
  ): ClientUnaryCall;
  getIncidentsStatic(
    request: GetIncidentsRequest,
    callback: (error: ServiceError | null, response: IncidentsStaticResponse) => void,
  ): ClientUnaryCall;
  getIncidentsStatic(
    request: GetIncidentsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: IncidentsStaticResponse) => void,
  ): ClientUnaryCall;
  getIncidentsStatic(
    request: GetIncidentsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: IncidentsStaticResponse) => void,
  ): ClientUnaryCall;
  /** udpated */
  updateStatusIncidentStatic(
    request: UpdateStatusIncidentRequest,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateStatusIncidentStatic(
    request: UpdateStatusIncidentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateStatusIncidentStatic(
    request: UpdateStatusIncidentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateIconIncidentStatic(
    request: UpdateIconIncidentRequest,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateIconIncidentStatic(
    request: UpdateIconIncidentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateIconIncidentStatic(
    request: UpdateIconIncidentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  /** Mobile Incidents */
  createIncidentMobile(
    request: CreateIncidentMobileRequest,
    callback: (error: ServiceError | null, response: IncidentMobileResponse) => void,
  ): ClientUnaryCall;
  createIncidentMobile(
    request: CreateIncidentMobileRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: IncidentMobileResponse) => void,
  ): ClientUnaryCall;
  createIncidentMobile(
    request: CreateIncidentMobileRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: IncidentMobileResponse) => void,
  ): ClientUnaryCall;
  getIncidentMobile(
    request: IncidentIdRequest,
    callback: (error: ServiceError | null, response: IncidentMobileResponse) => void,
  ): ClientUnaryCall;
  getIncidentMobile(
    request: IncidentIdRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: IncidentMobileResponse) => void,
  ): ClientUnaryCall;
  getIncidentMobile(
    request: IncidentIdRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: IncidentMobileResponse) => void,
  ): ClientUnaryCall;
  getIncidentsMobile(
    request: GetIncidentsRequest,
    callback: (error: ServiceError | null, response: IncidentsMobileResponse) => void,
  ): ClientUnaryCall;
  getIncidentsMobile(
    request: GetIncidentsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: IncidentsMobileResponse) => void,
  ): ClientUnaryCall;
  getIncidentsMobile(
    request: GetIncidentsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: IncidentsMobileResponse) => void,
  ): ClientUnaryCall;
  /** udpated */
  updateIncidentLocationMobile(
    request: UpdateIncidentMobileRequest,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateIncidentLocationMobile(
    request: UpdateIncidentMobileRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateIncidentLocationMobile(
    request: UpdateIncidentMobileRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateStatusIncidentMobile(
    request: UpdateStatusIncidentRequest,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateStatusIncidentMobile(
    request: UpdateStatusIncidentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  updateStatusIncidentMobile(
    request: UpdateStatusIncidentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: MessageResponse) => void,
  ): ClientUnaryCall;
  /** Combined */
  getNearbyIncidents(
    request: GetNearbyIncidentsRequest,
    callback: (error: ServiceError | null, response: GetNearbyIncidentsResponse) => void,
  ): ClientUnaryCall;
  getNearbyIncidents(
    request: GetNearbyIncidentsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetNearbyIncidentsResponse) => void,
  ): ClientUnaryCall;
  getNearbyIncidents(
    request: GetNearbyIncidentsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetNearbyIncidentsResponse) => void,
  ): ClientUnaryCall;
  /** verifyIncident (static only) */
  createVerifyIncident(
    request: CreateVerifyIncidentRequest,
    callback: (error: ServiceError | null, response: VerifyIncidentResponse) => void,
  ): ClientUnaryCall;
  createVerifyIncident(
    request: CreateVerifyIncidentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: VerifyIncidentResponse) => void,
  ): ClientUnaryCall;
  createVerifyIncident(
    request: CreateVerifyIncidentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: VerifyIncidentResponse) => void,
  ): ClientUnaryCall;
  getVerifyIncident(
    request: GetVerifyIncidentRequest,
    callback: (error: ServiceError | null, response: VerifyIncidentResponse) => void,
  ): ClientUnaryCall;
  getVerifyIncident(
    request: GetVerifyIncidentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: VerifyIncidentResponse) => void,
  ): ClientUnaryCall;
  getVerifyIncident(
    request: GetVerifyIncidentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: VerifyIncidentResponse) => void,
  ): ClientUnaryCall;
  getVerifysIncidentByUser(
    request: GetVerifyIncidentRequest,
    callback: (error: ServiceError | null, response: VerifysIncidentResponse) => void,
  ): ClientUnaryCall;
  getVerifysIncidentByUser(
    request: GetVerifyIncidentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: VerifysIncidentResponse) => void,
  ): ClientUnaryCall;
  getVerifysIncidentByUser(
    request: GetVerifyIncidentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: VerifysIncidentResponse) => void,
  ): ClientUnaryCall;
  getVerifysIncidentByIncident(
    request: GetVerifyIncidentRequest,
    callback: (error: ServiceError | null, response: VerifysIncidentResponse) => void,
  ): ClientUnaryCall;
  getVerifysIncidentByIncident(
    request: GetVerifyIncidentRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: VerifysIncidentResponse) => void,
  ): ClientUnaryCall;
  getVerifysIncidentByIncident(
    request: GetVerifyIncidentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: VerifysIncidentResponse) => void,
  ): ClientUnaryCall;
}

export const IncidentServiceClient = makeGenericClientConstructor(
  IncidentServiceService,
  "incidents.IncidentService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): IncidentServiceClient;
  service: typeof IncidentServiceService;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
