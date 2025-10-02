import { PoolClient, QueryResult } from "pg";
import pool from "../../common/db/config";
import { Status, StatusDB } from "../../domain/models/status";

export class StatusRepository {
  private readonly db = pool;

  public async getAll(lang: string): Promise<Status[]> {
    try {
      const query = `
            SELECT 
                id,
                ${lang} as "name"
            FROM status
        `;

      const result: QueryResult<Status> = await this.db.query(query);

      return result.rows;
    } catch (err) {
      const _err = err as Error;
      throw new Error(`${_err.message} in StatusRepository of getAll() method`);
    }
  }

  public async getByNameEN(name: string): Promise<StatusDB | null> {
    try {
      const query = `
	            SELECT
	                id,
	                es,
	                en
	            FROM status
	            WHERE en = '${name}'
	        `;

      const result: QueryResult<StatusDB> = await this.db.query(query);

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      const _err = err as Error;
      throw new Error(`${_err.message} in StatusRepository of getAll() method`);
    }
  }
}
