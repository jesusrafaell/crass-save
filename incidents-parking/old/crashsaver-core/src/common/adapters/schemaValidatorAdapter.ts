import Ajv, { ValidateFunction } from "ajv";
import AjvErrors from "ajv-errors";
import AjvFormats from "ajv-formats";
import { AnySchema, JTDDataType } from "ajv/dist/core";

export class SchemaValidatorAdapter {
  private ajv!: Ajv;
  private schema!: ValidateFunction<JTDDataType<any>>;
  private validSchema!: boolean;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
    AjvErrors(this.ajv);
    AjvFormats(this.ajv);
  }

  public compileSchema<T>(model: T) {
    this.schema = this.ajv.compile(model as AnySchema);
    return this.schema;
  }

  public verifySchema<T>(data: T) {
    this.validSchema = this.schema(data);
    this.verifyErrors();
    return this.validSchema;
  }

  private verifyErrors() {
    if (!this.validSchema) {
      const arrErrors = this.schema.errors;
      if (arrErrors) {
        for (let i = 0; i < arrErrors.length; i++) {
          const { instancePath, message, schemaPath } = arrErrors[i];
          throw new Error(
            `instancePath: ${instancePath}, message: ${message}, schemaPath: ${schemaPath}`,
          );
        }
      }
    }
  }
}
