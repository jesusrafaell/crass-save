import { QueryResult } from "pg";
import pool from "../../../../common/db/config/configPosgre";
import { UserBase, UserXCompany } from "../../domain/models/user";
import { CompanyDto } from "../../domain/models/truck/parkinglot";

export class UserXCompanyRepository {
  private readonly db = pool;

  public async getCompanyByUserId(userId: string): Promise<CompanyDto | null> {
    try {
      const query = `
        SELECT 
          c.id AS "id",
          c.name AS "name",
          c.description AS "description",
          c.credits AS "credits"
        FROM userxcompany uc
        JOIN public.pkl_companies c ON c.id = uc.id_company
        WHERE uc.id_user = $1
			`;
      const result: QueryResult<CompanyDto> = await this.db.query(query, [
        userId,
      ]);
      if (result.rows.length < 0) return null;

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getUsersByCompanyId(id: string): Promise<UserBase[]> {
    try {
      const query = `
				SELECT
          u.id as id,
          u.email as email
				FROM userxcompany uc
        JOIN auth_users u ON uc.id_user = u.id
        Where uc.id_company = $1
			`;
      const result: QueryResult<UserBase> = await this.db.query(query, [id]);
      return result.rows;
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}
