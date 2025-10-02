import { MomentAdapter } from "../../../../common/adapters/momentAdapter";
import { DaoLocalizationConnector } from "../../infra/connectors/daoLocalizationConnector";
import { Localization, LocalizationDB } from "../model/localization";

export class UpdateLocalizationService {
  constructor(
    private readonly _daoLocalizationConnector = new DaoLocalizationConnector(),
    private momentAdapter = new MomentAdapter(""),
  ) {}

  public async updateLocalization(
    id: string,
    localization: Partial<Localization>,
  ) {
    localization.last_update = this.momentAdapter.dateUnix();

    const localizationUpdated =
      await this._daoLocalizationConnector.updateLocalization(id, localization);

    if (!localizationUpdated) {
      throw new Error(
        `Localization doesn't exists: ${id}, UpdateLocalizationService method updateLocalization`,
      );
    }

    return { localizationUpdated };
  }

  public async updateLocalizationByUser(
    user_id: string,
    lat: number,
    lon: number,
  ) {
    const location: Partial<LocalizationDB> = {
      user_latitude: lat,
      user_longitude: lon,
      location: {
        type: "Point",
        coordinates: [lon, lat],
      },
      last_update: this.momentAdapter.dateUnix(),
    };

    const localizationUpdated =
      await this._daoLocalizationConnector.updateLocalizationByUser(
        user_id,
        location,
      );

    if (!localizationUpdated) {
      throw new Error(
        `Localization doesn't exists by user: ${user_id}, UpdateLocalizationService method updateLocalizationByUser`,
      );
    }

    return { localizationUpdated };
  }
}
