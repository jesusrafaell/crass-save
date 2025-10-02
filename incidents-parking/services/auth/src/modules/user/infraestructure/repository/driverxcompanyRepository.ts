import { QueryResult } from "pg";
import pool from "../../../../common/db/config/configPosgre";
import { DriverXCompanyRequest, UserRes } from "../../domain/models/user";
import DriverXCompanyModel from "../../domain/models/driverxcompany/schema";
import { DriverXCompanyDto } from "../../domain/models/driverxcompany";
import listCodeErrors from "../../../../common/utils/listCodeErrors";

export class DriverXCompanyRepository {
  private readonly db = pool;

  public async createAndUpdateDriverRole({
    driverId,
    companyId,
    roleId,
  }: DriverXCompanyRequest & { roleId: string }): Promise<void> {
    try {
      await this.db.query("BEGIN");
      await this.db.query(
        `
        UPDATE auth_users u
        SET id_auth_roles = array_append(id_auth_roles, $1)
        WHERE u.id = $2;
      `,
        [roleId, driverId]
      );
      await this.db.query(
        `
        INSERT INTO driverxcompany(id_driver, id_company)
        VALUES ($1, $2);
      `,
        [driverId, companyId]
      );
      await this.db.query("COMMIT");
    } catch (error) {
      await this.db.query("ROLLBACK");
      const _error = error as Error;
      throw _error;
    }
  }
  public async add({
    driverId,
    companyId,
  }: DriverXCompanyRequest): Promise<void> {
    try {
      const query = `
      INSERT INTO driverxcompany(
        id_driver, id_company)
        VALUES ($1, $2)
      `;

      await this.db.query(query, [driverId, companyId]);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getByIds({
    driverId,
    companyId,
  }: DriverXCompanyRequest): Promise<boolean> {
    try {
      const query = `
          SELECT dxc.*
          FROM driverxcompany dxc
          WHERE dxc.id_driver = $1 AND dxc.id_company = $2
      `;

      const driverxcompany = await this.db.query(query, [driverId, companyId]);

      return !!driverxcompany.rows.length;
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async delete({
    driverId,
    companyId,
  }: DriverXCompanyRequest): Promise<void> {
    try {
      const query = `DELETE FROM driverxcompany 
                     WHERE id_driver = $1 AND id_company = $2`;

      await this.db.query(query, [driverId, companyId]);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getDriversByCompanyId(companyId: string): Promise<UserRes[]> {
    try {
      const query = `
        SELECT
            u.id as id,
            u.first_name as first_name,
            u.last_name as last_name,
            u.email as email,
            u.mobile as mobile,
            u.password as password,
            u.distance_radius as distance_radius,
            u.utc as utc,
            u.fcm_token as fcm_token,
            u.guest as guest,
            jsonb_agg(
                jsonb_build_object(
                    'id', ar.id,
                    'name', ar.name,
                    'key', ar.key
                )
            ) AS roles,
            jsonb_build_object(
                'id', s.id,
                'name', s.en
            ) AS status,
            u.created_at as created_time,
            u.updated_at as updated_time
        FROM driverxcompany dxc
        JOIN auth_users u ON u.id = dxc.id_driver
        JOIN status s ON u.id_status = s.id
        LEFT JOIN auth_roles ar ON ar.id = ANY(u.id_auth_roles)
        WHERE dxc.id_company = $1
        GROUP BY u.id, s.id
    `;

      const result: QueryResult<UserRes> = await this.db.query(query, [
        companyId,
      ]);
      return result.rows;
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getNameCompanyByCompanyId(companyId: string): Promise<string> {
    try {
      const query = `
          SELECT c.name
          FROM pkl_companies c
          WHERE c.id = $1
      `;

      const result: QueryResult<{ name: string }> = await this.db.query(query, [
        companyId,
      ]);
      if (result.rows[0]?.name) return result.rows[0].name;

      throw new Error(listCodeErrors.companyNotFound.code);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async saveCompanyIdAndToken(
    data: DriverXCompanyDto
  ): Promise<DriverXCompanyDto> {
    try {
      const driverxcompany = new DriverXCompanyModel(data);
      return await driverxcompany.save();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in DriverXCompanyRepository of saveCompanyIdAndToken method`
      );
    }
  }
}
