import { VersionRepository } from "../../infra/repository/versionRepository";

export class VersionService {
  constructor(private readonly versionRepository = new VersionRepository()) {}

  public async get() {
    const version = await this.versionRepository.get();
    return version;
  }
}
