import { ObjectId } from "bson";
import { MomentAdapter } from "../../../../common/adapters/momentAdapter";
import { SchemaValidatorAdapter } from "../../../../common/adapters/schemaValidatorAdapter";
import { DaoLocalizationConnector } from "../../infra/connectors/daoLocalizationConnector";
import { DTOCreateLocalization, Localization } from "../model/localization";
import { LocalizationSchema } from "../model/localizationSchema";

export class CreateLocalizationService {
  private localization!: Localization;
  private momentAdapter!: MomentAdapter;
  constructor(
    private readonly _daoLocalizationConnector = new DaoLocalizationConnector(),
    private readonly _schemaValidatorAdapter = new SchemaValidatorAdapter(),
  ) {}

  public async createLocalizationByUser(
    data: DTOCreateLocalization,
    user_id: string,
  ) {
    this.initializeLocalization(data, user_id);
    this._schemaValidatorAdapter.compileSchema(LocalizationSchema);
    this._schemaValidatorAdapter.verifySchema(this.localization);
    const inserLocalization =
      await this._daoLocalizationConnector.createLocalization(
        this.localization,
      );
    this.localization._id = inserLocalization.insertedId.toString();

    return {
      localization: this.localization,
    };
  }

  private initializeLocalization(data: DTOCreateLocalization, user_id: string) {
    //this case user utc o universal utc
    const localUTC = "Europe/Madrid";
    this.momentAdapter = new MomentAdapter(localUTC);
    const currentTime = this.momentAdapter.dateUnix();

    this.localization = {
      _id: "",
      user_latitude: data.user_latitude,
      user_longitude: data.user_longitude,
      location: {
        type: "Point",
        coordinates: [data.user_longitude, data.user_latitude],
      },
      last_update: currentTime,
      user_id: user_id,
    };
  }
}
