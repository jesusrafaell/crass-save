import { FastifyRequest } from "fastify";

interface CommonPropertySchema {
  type: string;
  errorMessage?: string;
  default?: any;
}

interface StringPropertySchema extends CommonPropertySchema {
  format?: string;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
}

interface NumberPropertySchema extends CommonPropertySchema {
  minimum?: number;
  maximum?: number;
}

type Properties = {
  [key: string]: StringPropertySchema | NumberPropertySchema;
};

interface BodySchema extends CommonPropertySchema {
  type: string;
  required?: string[];
  properties: Properties;
}

interface Schema {
  body: BodySchema;
  additionalProperties?: boolean;
  errorMessage?: {
    required?: string;
  };
}

class Validator {
  static readonly emailRegex: RegExp =
    /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  static checkRequiredExist(data: object, required: string[]): void {
    const dataKeys = Object.keys(data);
    for (const prop of required) {
      if (!dataKeys.includes(prop))
        throw {
          message: `must have required property '${prop}'`,
        };
    }
  }

  static checkTypes(
    key: string,
    value: string,
    property: StringPropertySchema | NumberPropertySchema,
    required?: string[]
  ): void {
    const message = `'${key}' must be of type ${property.type}`;
    const isDiff = property.type !== typeof value;

    if (required?.includes(key)) {
      if (isDiff) throw { message };
    } else {
      if (isDiff && typeof value !== "undefined") throw { message };
    }
  }

  static checkStringConstraints(
    key: string,
    value: string,
    property: StringPropertySchema
  ) {
    if (property.minLength && value.length < property.minLength) {
      throw {
        message:
          property.errorMessage ??
          `'${key}' must be greater than or equal to ${property.minLength}`,
      };
    }
    if (property.maxLength && value.length > property.maxLength) {
      throw {
        message:
          property.errorMessage ??
          `'${key}' must be less than or equal to ${property.maxLength}`,
      };
    }
    if (property.format === "email" && !this.emailRegex.test(value)) {
      throw {
        message: property.errorMessage ?? `'${key}' it isn't a valid email`,
      };
    }
    if (property.pattern && property.pattern.test(value)) {
      throw {
        message: property.errorMessage ?? `'${key}' doesn't match the pattern`,
      };
    }
  }

  static checkNumberConstraints(
    key: string,
    value: number,
    property: NumberPropertySchema
  ) {
    if (
      (property.minimum && value < property.minimum) ||
      (property.maximum && value > property.maximum)
    )
      throw {
        message:
          property.errorMessage ??
          `'${key}' must be within the range [${property.minimum},${property.maximum}]`,
      };
  }

  static async validateHook(request: FastifyRequest): Promise<boolean> {
    const schema = request.routeOptions.schema as Schema;
    const data = request.body as object;
    return Validator.validate(schema, data);
  }

  static validate(schema: Schema, data: object) {
    const { additionalProperties } = schema;
    const { type, required, properties } = schema.body;

    if (type !== typeof data)
      throw {
        message: `typeof body schema must be of type ${type}`,
      };

    if (!!required?.length) Validator.checkRequiredExist(data, required);

    if (properties) {
      for (const key in properties) {
        const property = properties[key];
        const value = (data as any)[key];

        if (value === undefined) (data as any)[key] = property.default;

        Validator.checkTypes(key, value, property, required);

        if (property.type === "string") {
          Validator.checkStringConstraints(key, value, property);
        } else if (property.type === "number") {
          Validator.checkNumberConstraints(key, value, property);
        }
      }
    }

    if (
      !additionalProperties &&
      Object.keys(data).some(
        (key) => !properties || !properties.hasOwnProperty(key)
      )
    ) {
      const acceptedProperties = Object.keys(properties).join(", ");
      throw {
        message: `Only the following properties are accepted: ${acceptedProperties}`,
      };
    }

    return true;
  }
}

export default Validator;
