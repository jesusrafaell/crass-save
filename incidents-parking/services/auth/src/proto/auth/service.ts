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
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fcm";

export interface TokenRequest {
  token: string;
}

export interface TokenResponse {
  userId: string;
  email: string;
  os: string;
  role: string;
  msgError: string;
  codeError: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  distanceRadius: number;
  fcmToken: string;
  statusEN: string;
}

export interface GetUserRequest {
  userId: string;
}

export interface GetUserResponse {
  user: User | undefined;
}

function createBaseTokenRequest(): TokenRequest {
  return { token: "" };
}

export const TokenRequest = {
  encode(message: TokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.token = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TokenRequest {
    return { token: isSet(object.token) ? globalThis.String(object.token) : "" };
  },

  toJSON(message: TokenRequest): unknown {
    const obj: any = {};
    if (message.token !== "") {
      obj.token = message.token;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenRequest>, I>>(base?: I): TokenRequest {
    return TokenRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TokenRequest>, I>>(object: I): TokenRequest {
    const message = createBaseTokenRequest();
    message.token = object.token ?? "";
    return message;
  },
};

function createBaseTokenResponse(): TokenResponse {
  return { userId: "", email: "", os: "", role: "", msgError: "", codeError: 0 };
}

export const TokenResponse = {
  encode(message: TokenResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.os !== "") {
      writer.uint32(26).string(message.os);
    }
    if (message.role !== "") {
      writer.uint32(34).string(message.role);
    }
    if (message.msgError !== "") {
      writer.uint32(42).string(message.msgError);
    }
    if (message.codeError !== 0) {
      writer.uint32(48).int32(message.codeError);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TokenResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.os = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.role = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.msgError = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.codeError = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TokenResponse {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      os: isSet(object.os) ? globalThis.String(object.os) : "",
      role: isSet(object.role) ? globalThis.String(object.role) : "",
      msgError: isSet(object.msgError) ? globalThis.String(object.msgError) : "",
      codeError: isSet(object.codeError) ? globalThis.Number(object.codeError) : 0,
    };
  },

  toJSON(message: TokenResponse): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.os !== "") {
      obj.os = message.os;
    }
    if (message.role !== "") {
      obj.role = message.role;
    }
    if (message.msgError !== "") {
      obj.msgError = message.msgError;
    }
    if (message.codeError !== 0) {
      obj.codeError = Math.round(message.codeError);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TokenResponse>, I>>(base?: I): TokenResponse {
    return TokenResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TokenResponse>, I>>(object: I): TokenResponse {
    const message = createBaseTokenResponse();
    message.userId = object.userId ?? "";
    message.email = object.email ?? "";
    message.os = object.os ?? "";
    message.role = object.role ?? "";
    message.msgError = object.msgError ?? "";
    message.codeError = object.codeError ?? 0;
    return message;
  },
};

function createBaseUser(): User {
  return { id: "", email: "", firstName: "", lastName: "", mobile: "", distanceRadius: 0, fcmToken: "", statusEN: "" };
}

export const User = {
  encode(message: User, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.firstName !== "") {
      writer.uint32(26).string(message.firstName);
    }
    if (message.lastName !== "") {
      writer.uint32(34).string(message.lastName);
    }
    if (message.mobile !== "") {
      writer.uint32(42).string(message.mobile);
    }
    if (message.distanceRadius !== 0) {
      writer.uint32(48).int32(message.distanceRadius);
    }
    if (message.fcmToken !== "") {
      writer.uint32(58).string(message.fcmToken);
    }
    if (message.statusEN !== "") {
      writer.uint32(66).string(message.statusEN);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): User {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser();
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

          message.email = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.firstName = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.lastName = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.mobile = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.distanceRadius = reader.int32();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.fcmToken = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.statusEN = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): User {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      firstName: isSet(object.firstName) ? globalThis.String(object.firstName) : "",
      lastName: isSet(object.lastName) ? globalThis.String(object.lastName) : "",
      mobile: isSet(object.mobile) ? globalThis.String(object.mobile) : "",
      distanceRadius: isSet(object.distanceRadius) ? globalThis.Number(object.distanceRadius) : 0,
      fcmToken: isSet(object.fcmToken) ? globalThis.String(object.fcmToken) : "",
      statusEN: isSet(object.statusEN) ? globalThis.String(object.statusEN) : "",
    };
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.firstName !== "") {
      obj.firstName = message.firstName;
    }
    if (message.lastName !== "") {
      obj.lastName = message.lastName;
    }
    if (message.mobile !== "") {
      obj.mobile = message.mobile;
    }
    if (message.distanceRadius !== 0) {
      obj.distanceRadius = Math.round(message.distanceRadius);
    }
    if (message.fcmToken !== "") {
      obj.fcmToken = message.fcmToken;
    }
    if (message.statusEN !== "") {
      obj.statusEN = message.statusEN;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<User>, I>>(base?: I): User {
    return User.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<User>, I>>(object: I): User {
    const message = createBaseUser();
    message.id = object.id ?? "";
    message.email = object.email ?? "";
    message.firstName = object.firstName ?? "";
    message.lastName = object.lastName ?? "";
    message.mobile = object.mobile ?? "";
    message.distanceRadius = object.distanceRadius ?? 0;
    message.fcmToken = object.fcmToken ?? "";
    message.statusEN = object.statusEN ?? "";
    return message;
  },
};

function createBaseGetUserRequest(): GetUserRequest {
  return { userId: "" };
}

export const GetUserRequest = {
  encode(message: GetUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): GetUserRequest {
    return { userId: isSet(object.userId) ? globalThis.String(object.userId) : "" };
  },

  toJSON(message: GetUserRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserRequest>, I>>(base?: I): GetUserRequest {
    return GetUserRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserRequest>, I>>(object: I): GetUserRequest {
    const message = createBaseGetUserRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseGetUserResponse(): GetUserResponse {
  return { user: undefined };
}

export const GetUserResponse = {
  encode(message: GetUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.user !== undefined) {
      User.encode(message.user, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.user = User.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserResponse {
    return { user: isSet(object.user) ? User.fromJSON(object.user) : undefined };
  },

  toJSON(message: GetUserResponse): unknown {
    const obj: any = {};
    if (message.user !== undefined) {
      obj.user = User.toJSON(message.user);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserResponse>, I>>(base?: I): GetUserResponse {
    return GetUserResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserResponse>, I>>(object: I): GetUserResponse {
    const message = createBaseGetUserResponse();
    message.user = (object.user !== undefined && object.user !== null) ? User.fromPartial(object.user) : undefined;
    return message;
  },
};

export type AuthServiceService = typeof AuthServiceService;
export const AuthServiceService = {
  session: {
    path: "/fcm.AuthService/Session",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: TokenRequest) => Buffer.from(TokenRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TokenRequest.decode(value),
    responseSerialize: (value: TokenResponse) => Buffer.from(TokenResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TokenResponse.decode(value),
  },
  verifyToken: {
    path: "/fcm.AuthService/VerifyToken",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: TokenRequest) => Buffer.from(TokenRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TokenRequest.decode(value),
    responseSerialize: (value: TokenResponse) => Buffer.from(TokenResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TokenResponse.decode(value),
  },
  getUser: {
    path: "/fcm.AuthService/GetUser",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetUserRequest) => Buffer.from(GetUserRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetUserRequest.decode(value),
    responseSerialize: (value: GetUserResponse) => Buffer.from(GetUserResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetUserResponse.decode(value),
  },
} as const;

export interface AuthServiceServer extends UntypedServiceImplementation {
  session: handleUnaryCall<TokenRequest, TokenResponse>;
  verifyToken: handleUnaryCall<TokenRequest, TokenResponse>;
  getUser: handleUnaryCall<GetUserRequest, GetUserResponse>;
}

export interface AuthServiceClient extends Client {
  session(
    request: TokenRequest,
    callback: (error: ServiceError | null, response: TokenResponse) => void,
  ): ClientUnaryCall;
  session(
    request: TokenRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: TokenResponse) => void,
  ): ClientUnaryCall;
  session(
    request: TokenRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: TokenResponse) => void,
  ): ClientUnaryCall;
  verifyToken(
    request: TokenRequest,
    callback: (error: ServiceError | null, response: TokenResponse) => void,
  ): ClientUnaryCall;
  verifyToken(
    request: TokenRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: TokenResponse) => void,
  ): ClientUnaryCall;
  verifyToken(
    request: TokenRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: TokenResponse) => void,
  ): ClientUnaryCall;
  getUser(
    request: GetUserRequest,
    callback: (error: ServiceError | null, response: GetUserResponse) => void,
  ): ClientUnaryCall;
  getUser(
    request: GetUserRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetUserResponse) => void,
  ): ClientUnaryCall;
  getUser(
    request: GetUserRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetUserResponse) => void,
  ): ClientUnaryCall;
}

export const AuthServiceClient = makeGenericClientConstructor(AuthServiceService, "fcm.AuthService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): AuthServiceClient;
  service: typeof AuthServiceService;
  serviceName: string;
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
