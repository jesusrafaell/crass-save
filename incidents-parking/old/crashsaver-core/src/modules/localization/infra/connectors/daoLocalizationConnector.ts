import { DeleteResult, InsertOneResult, ModifyResult } from "mongodb";
import { Localization, LocalizationDB } from "../../domain/model/localization";
import { DaoLocalizationRepository } from "../repository/daoLocalizationRepository";
import { DTODataByRadius } from "../../../incident/domain/model/incident";

export class DaoLocalizationConnector {
  constructor(
    private readonly daoLocalizationRepository = new DaoLocalizationRepository(),
  ) {}

  public async createLocalization(
    localization: Localization,
  ): Promise<InsertOneResult<LocalizationDB>> {
    return this.daoLocalizationRepository.createLocalization(localization);
  }

  public async getLocalizationByUserId(
    userId: string,
  ): Promise<LocalizationDB> {
    return this.daoLocalizationRepository.getLocalizationByUserId(userId);
  }

  public async getLocalizationById(id: string): Promise<Localization> {
    return this.daoLocalizationRepository.getLocalizationById(id);
  }

  public async updateLocalization(
    id: string,
    data: Partial<Localization>,
  ): Promise<ModifyResult<Localization>> {
    return this.daoLocalizationRepository.updateLocalization(id, data);
  }

  public async deleteLocalization(id: string): Promise<DeleteResult> {
    return this.daoLocalizationRepository.deleteLocalization(id);
  }

  public async getLocalizationsInRadius(
    sort: any,
    limit: number,
    skip: number,
    data: DTODataByRadius,
  ): Promise<Localization[]> {
    return this.daoLocalizationRepository.getLocalizationsInRadius(
      sort,
      limit,
      skip,
      data,
    );
  }

  public async getLocalizationsGeospatial(
    data: DTODataByRadius,
  ): Promise<Localization[]> {
    return this.daoLocalizationRepository.getLocalizationsGeospatial(data);
  }

  public async updateLocalizationByUser(
    user_id: string,
    data: Partial<LocalizationDB>,
  ): Promise<ModifyResult<LocalizationDB>> {
    return this.daoLocalizationRepository.updateLocalizationByUser(
      user_id,
      data,
    );
  }
}
