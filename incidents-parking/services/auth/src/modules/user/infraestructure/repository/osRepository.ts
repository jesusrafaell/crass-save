import { QueryResult } from "pg";
import pool from "../../../../common/db/config/configPosgre";
import { OS } from "../../domain/models/general";

export class OSRepository {
  private readonly db = pool;

  public async getAll() {
    //aqui solo logica de base de datos
    try {
      //primero validar si existe el usuario con id_user
      const query = `SELECT * FROM os `;
      const result: QueryResult<OS> = await this.db.query(query);

      if (result.rows.length < 0) return null;

      return result.rows;
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getByName(name: string): Promise<OS | null> {
    try {
      const query = `
				SELECT
					id as id,
					name as name,
					'key' as "key"
				FROM os WHERE LOWER(name) = LOWER('${name}')
			`;
      const result: QueryResult<OS> = await this.db.query(query);

      if (result.rows.length < 0) return null;

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}
