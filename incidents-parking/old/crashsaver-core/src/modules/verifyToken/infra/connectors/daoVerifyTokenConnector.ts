import { InsertOneResult } from "mongodb";
import {
  TypeVerifyToken,
  VerifyToken,
  VerifyTokenDB,
} from "../../domain/model/token";
import { DaoTokensRepository } from "../repository/daoVerifyTokensRepository";

export class DaoVerifyTokenConnector {
  constructor(private daoTokensRepository = new DaoTokensRepository()) {}

  public async save(
    token: VerifyToken,
  ): Promise<InsertOneResult<VerifyTokenDB>> {
    return this.daoTokensRepository.save(token);
  }

  public async getByToken(
    token: string,
    type: TypeVerifyToken,
  ): Promise<VerifyTokenDB | null> {
    return this.daoTokensRepository.getByToken(token, type);
  }

  public async getByUser(id: string, type: TypeVerifyToken) {
    return this.daoTokensRepository.getByUser(id, type);
  }

  public async delete(id: string) {
    return this.daoTokensRepository.delete(id);
  }
}
