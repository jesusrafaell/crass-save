import { DaoLocalizationConnector } from "../../infra/connectors/daoLocalizationConnector";
import { GetUserService } from "../../../user/domain/services/getUser.service";
import { DTODataByRadius } from "../../../incident/domain/model/incident";

export class GetLocalizationService {
  constructor(
    private readonly _getUserService = new GetUserService(),
    private readonly daoLocalizationConnector = new DaoLocalizationConnector(),
  ) {}

  public async getLocalizationByUserId(userId: string) {
    const user = await this._getUserService.getUserById(userId);

    if (!user) {
      throw new Error(
        `User doesn't exists: ${userId}, GetLocalizationService method getLocalizationByUserId`,
      );
    }

    const localization =
      await this.daoLocalizationConnector.getLocalizationByUserId(userId);

    return localization;
  }

  public async getLocalizationUser(userId: string) {
    return await this.daoLocalizationConnector.getLocalizationByUserId(userId);
  }

  public async getLocalizationsInRadius(
    sort: any,
    limit: number,
    skip: number,
    data: DTODataByRadius,
  ) {
    const localizations =
      await this.daoLocalizationConnector.getLocalizationsInRadius(
        sort,
        limit,
        skip,
        data,
      );

    return { localizations };
  }

  public async getLocationGeospatialByRadius(data: DTODataByRadius) {
    const localizations =
      await this.daoLocalizationConnector.getLocalizationsGeospatial(data);

    return { localizations };
  }
}
