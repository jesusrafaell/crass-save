import { MomentAdapter } from "../../../../common/adapters/momentAdapter";
import { VersionRepository } from "../../infra/repository/versionRepository";
import { Version } from "../model/version";

export class VersionService {
    constructor(
        private readonly versionRepository = new VersionRepository(),
        private momentAdapter = new MomentAdapter("")
    ) { }

  public async get() {
    const version = await this.versionRepository.get();

    return version;
  }

  public async update(id: string, version: Partial<Version>) {
    version.updated_at= this.momentAdapter.dateUnix()
    const res = await this.versionRepository.update(id, version);

    return res;
  }
}
