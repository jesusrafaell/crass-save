import { QueryResult } from "pg";
import pool from "../../../../common/db/config/configPosgre";
import { Status, StatusDB } from "../../domain/models";

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

  public async getByName(name: string): Promise<StatusDB | null> {
    try {
      const query = `
	            SELECT
	                id,
	                es,
	                en
	            FROM status
	            WHERE LOWER(en) = LOWER($1)
	        `;

      const result: QueryResult<StatusDB> = await this.db.query(query, [name]);
      if (result.rows.length < 0) return null;

      return result.rows[0];
    } catch (err) {
      const _err = err as Error;
      throw new Error(`${_err.message} in StatusRepository of getAll() method`);
    }
  }

  public async getById(id: string): Promise<StatusDB | null> {
    try {
      const query = `SELECT * FROM status where id = $1 `;
      const result: QueryResult<StatusDB> = await this.db.query(query, [id]);

      if (result.rows.length < 1) throw new Error("Status not found");

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}
