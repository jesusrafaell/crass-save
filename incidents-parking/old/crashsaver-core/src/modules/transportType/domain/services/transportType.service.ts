import listCodeErrors from "../../../../common/middlewares/listCodeErrors";
import { DaoTransportTypeConnector } from "../../infra/connectors/daoTransportTypeConnector";

export class TransportTypeService {
  constructor(
    private readonly daoTransportTypeConnector = new DaoTransportTypeConnector(),
  ) {}

  public async getAll(sort: any, limit: number, skip: number) {
    const types = await this.daoTransportTypeConnector.getAll(
      sort,
      limit,
      skip,
    );

    return { types };
  }

  public async get(id: string) {
    const types = await this.daoTransportTypeConnector.getById(id);

    if (!types) {
      throw new Error(listCodeErrors.transportTypeNotFound.code);
    }

    return { types };
  }

  public async getByKey(key: number) {
    const types = await this.daoTransportTypeConnector.getByKey(key);

    if (!types) {
      throw new Error(listCodeErrors.transportTypeNotFound.code);
    }

    return types;
  }

  // public async save(t: Role) {
  //   return await this.daoTransportTypeConnector.create(role);
  // }
}
