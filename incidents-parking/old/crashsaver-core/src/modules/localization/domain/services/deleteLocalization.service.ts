import { DaoLocalizationConnector } from "../../infra/connectors/daoLocalizationConnector";

export class DeleteLocalizationService {
  constructor(
    private readonly _daoLocalizationConnector = new DaoLocalizationConnector(),
  ) {}

  public async deleteLocalization(id: string) {
    const localizationDeleted =
      await this._daoLocalizationConnector.deleteLocalization(id);

    if (!localizationDeleted) {
      throw new Error(
        `Localization doesn't exists: ${id}, DeleteLocalizationService method deleteLocalization`,
      );
    }
  }
}
