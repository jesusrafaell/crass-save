import { DaoIncidentNotificationConnector } from "../../infra/connectors/daoIncidentNotificationConnector";

export class GetIncidentNotificationService {
  constructor(
    private readonly daoIncidentNotificationConnector = new DaoIncidentNotificationConnector(),
  ) {}

  public async getIncidentsNotificationByUser(
    sort: any,
    limit: number,
    skip: number,
    userId: string,
  ) {
    const incidentNotifications =
      await this.daoIncidentNotificationConnector.getIncidentNotificationsByUserId(
        sort,
        limit,
        skip,
        userId,
      );

    return { incidentNotifications };
  }
}
