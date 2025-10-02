import { Version } from "../../domain/model/version";
import VersionModel from "../../domain/model/versionSchema";

export class VersionRepository {
  public async get(): Promise<Version | null> {
    try {
      return await VersionModel.findOne();
    } catch (error) {
      const _error = error as Error;
      throw new Error(`${_error.message} in VersionRepository of get() method`);
    }
  }
}
