import { DeleteResult, InsertOneResult, ModifyResult } from "mongodb";
import { DaoIncidentNotificationRepository } from "../repository/daoIncidentNotificationRepository";
import { IncidentNotificationDB } from "../../domain/model/incidentNotification";

export class DaoIncidentNotificationConnector {
  constructor(
    private daoIncidentNotificationRepository = new DaoIncidentNotificationRepository(),
  ) {}

  public async getIncidentNotification(
    id: string,
  ): Promise<IncidentNotificationDB> {
    return this.daoIncidentNotificationRepository.getIncidentNoficationById(id);
  }

  public async getIncidentNotificationsByUserId(
    sort: any,
    limit: number,
    skip: number,
    user_id: string,
  ): Promise<IncidentNotificationDB[]> {
    return this.daoIncidentNotificationRepository.getIncidentsNoficationByUserId(
      sort,
      limit,
      skip,
      user_id,
    );
  }

  public async createIncidentNotification(
    incidentNotification: IncidentNotificationDB,
  ): Promise<InsertOneResult<IncidentNotificationDB>> {
    return this.daoIncidentNotificationRepository.createIncidentNofication(
      incidentNotification,
    );
  }

  public async updateIncidentNotification(
    id: string,
    data: any,
  ): Promise<ModifyResult<IncidentNotificationDB>> {
    return this.daoIncidentNotificationRepository.updateIncidentNofication(
      id,
      data,
    );
  }

  public async deleteIncidentNotification(id: string): Promise<DeleteResult> {
    return this.daoIncidentNotificationRepository.deleteIncidentNofication(id);
  }
}
