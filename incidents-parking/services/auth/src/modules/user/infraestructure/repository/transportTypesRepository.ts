import { QueryResult } from "pg";
import pool from "../../../../common/db/config/configPosgre";
import { TransportTypes } from "../../domain/models/general";
import listCodeErrors from "../../../../common/utils/listCodeErrors";

export class TransportTypeRepository {
  private readonly db = pool;

  public async getAll(): Promise<TransportTypes[]> {
    try {
      const query = `
                SELECT 
                    id,
                    name ,
                    key 
                FROM transport_types
            `;

      const result: QueryResult<TransportTypes> = await this.db.query(query);

      return result.rows;
    } catch (err) {
      const _err = err as Error;
      throw new Error(`${_err.message} in StatusRepository of getAll() method`);
    }
  }

  public async getByKey(key: number): Promise<TransportTypes | null> {
    try {
      const query = "SELECT id, name , key FROM transport_types WHERE key = $1";

      const result: QueryResult<TransportTypes> = await this.db.query(query, [
        key,
      ]);

      if (result.rows.length < 0) return null;

      return result.rows[0];
    } catch (err) {
      const _err = err as Error;
      throw new Error(`${_err.message} in StatusRepository of getAll() method`);
    }
  }

  public async getById(id: string): Promise<TransportTypes | null> {
    try {
      const query = `
                SELECT 
                    id,
                    name ,
                    key
                FROM transport_types
                WHERE id = ${id}
            `;
      const result: QueryResult<TransportTypes> = await this.db.query(query);

      if (result.rows.length < 1)
        throw new Error(listCodeErrors.userNotFound.code);

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}
