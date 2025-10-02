/* eslint-disable */
import {
  ChannelCredentials,
  Client,
  makeGenericClientConstructor,
  Metadata,
} from "@grpc/grpc-js";
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

export interface MessageFCM {
  fcmToken: string;
  title: string;
  message: string;
  sound: string;
}

export interface SendMessageFCMRequest {
  fcm: MessageFCM | undefined;
}

export interface SendMessageFCMResponse {
  fcm: MessageFCM | undefined;
  ok: boolean;
}

function createBaseMessageFCM(): MessageFCM {
  return { fcmToken: "", title: "", message: "", sound: "" };
}

export const MessageFCM = {
  encode(
    message: MessageFCM,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.fcmToken !== "") {
      writer.uint32(10).string(message.fcmToken);
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    if (message.sound !== "") {
      writer.uint32(34).string(message.sound);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageFCM {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageFCM();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.fcmToken = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.title = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.message = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.sound = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageFCM {
    return {
      fcmToken: isSet(object.fcmToken)
        ? globalThis.String(object.fcmToken)
        : "",
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      sound: isSet(object.sound) ? globalThis.String(object.sound) : "",
    };
  },

  toJSON(message: MessageFCM): unknown {
    const obj: any = {};
    if (message.fcmToken !== "") {
      obj.fcmToken = message.fcmToken;
    }
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    if (message.sound !== "") {
      obj.sound = message.sound;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageFCM>, I>>(base?: I): MessageFCM {
    return MessageFCM.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageFCM>, I>>(
    object: I,
  ): MessageFCM {
    const message = createBaseMessageFCM();
    message.fcmToken = object.fcmToken ?? "";
    message.title = object.title ?? "";
    message.message = object.message ?? "";
    message.sound = object.sound ?? "";
    return message;
  },
};

function createBaseSendMessageFCMRequest(): SendMessageFCMRequest {
  return { fcm: undefined };
}

export const SendMessageFCMRequest = {
  encode(
    message: SendMessageFCMRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.fcm !== undefined) {
      MessageFCM.encode(message.fcm, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): SendMessageFCMRequest {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendMessageFCMRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.fcm = MessageFCM.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SendMessageFCMRequest {
    return {
      fcm: isSet(object.fcm) ? MessageFCM.fromJSON(object.fcm) : undefined,
    };
  },

  toJSON(message: SendMessageFCMRequest): unknown {
    const obj: any = {};
    if (message.fcm !== undefined) {
      obj.fcm = MessageFCM.toJSON(message.fcm);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SendMessageFCMRequest>, I>>(
    base?: I,
  ): SendMessageFCMRequest {
    return SendMessageFCMRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SendMessageFCMRequest>, I>>(
    object: I,
  ): SendMessageFCMRequest {
    const message = createBaseSendMessageFCMRequest();
    message.fcm =
      object.fcm !== undefined && object.fcm !== null
        ? MessageFCM.fromPartial(object.fcm)
        : undefined;
    return message;
  },
};

function createBaseSendMessageFCMResponse(): SendMessageFCMResponse {
  return { fcm: undefined, ok: false };
}

export const SendMessageFCMResponse = {
  encode(
    message: SendMessageFCMResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.fcm !== undefined) {
      MessageFCM.encode(message.fcm, writer.uint32(10).fork()).ldelim();
    }
    if (message.ok === true) {
      writer.uint32(16).bool(message.ok);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): SendMessageFCMResponse {
    const reader =
      input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendMessageFCMResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.fcm = MessageFCM.decode(reader, reader.uint32());
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

  fromJSON(object: any): SendMessageFCMResponse {
    return {
      fcm: isSet(object.fcm) ? MessageFCM.fromJSON(object.fcm) : undefined,
      ok: isSet(object.ok) ? globalThis.Boolean(object.ok) : false,
    };
  },

  toJSON(message: SendMessageFCMResponse): unknown {
    const obj: any = {};
    if (message.fcm !== undefined) {
      obj.fcm = MessageFCM.toJSON(message.fcm);
    }
    if (message.ok === true) {
      obj.ok = message.ok;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SendMessageFCMResponse>, I>>(
    base?: I,
  ): SendMessageFCMResponse {
    return SendMessageFCMResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SendMessageFCMResponse>, I>>(
    object: I,
  ): SendMessageFCMResponse {
    const message = createBaseSendMessageFCMResponse();
    message.fcm =
      object.fcm !== undefined && object.fcm !== null
        ? MessageFCM.fromPartial(object.fcm)
        : undefined;
    message.ok = object.ok ?? false;
    return message;
  },
};

export type FCMServiceService = typeof FCMServiceService;
export const FCMServiceService = {
  sendMessageFcm: {
    path: "/fcm.FCMService/SendMessageFCM",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: SendMessageFCMRequest) =>
      Buffer.from(SendMessageFCMRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => SendMessageFCMRequest.decode(value),
    responseSerialize: (value: SendMessageFCMResponse) =>
      Buffer.from(SendMessageFCMResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      SendMessageFCMResponse.decode(value),
  },
} as const;

export interface FCMServiceServer extends UntypedServiceImplementation {
  sendMessageFcm: handleUnaryCall<
    SendMessageFCMRequest,
    SendMessageFCMResponse
  >;
}

export interface FCMServiceClient extends Client {
  sendMessageFcm(
    request: SendMessageFCMRequest,
    callback: (
      error: ServiceError | null,
      response: SendMessageFCMResponse,
    ) => void,
  ): ClientUnaryCall;
  sendMessageFcm(
    request: SendMessageFCMRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: SendMessageFCMResponse,
    ) => void,
  ): ClientUnaryCall;
  sendMessageFcm(
    request: SendMessageFCMRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: SendMessageFCMResponse,
    ) => void,
  ): ClientUnaryCall;
}

export const FCMServiceClient = makeGenericClientConstructor(
  FCMServiceService,
  "fcm.FCMService",
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ClientOptions>,
  ): FCMServiceClient;
  service: typeof FCMServiceService;
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
  ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
