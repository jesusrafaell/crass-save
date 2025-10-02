import { QueryResult } from "pg";
import pool from "../../../../common/db/config/configPosgre";
import { Role } from "../../domain/models/general";

export class RolesRepository {
  private readonly db = pool;

  public async getByName(name: string): Promise<Role | null> {
    try {
      //valida si es guest y define status
      const query = `
				SELECT
					id,
					name,
					 key
				FROM auth_roles
				WHERE LOWER(name) = LOWER('${name}')
			`;
      const result: QueryResult<Role> = await this.db.query(query);
      if (result.rows.length < 0) return null;

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}
