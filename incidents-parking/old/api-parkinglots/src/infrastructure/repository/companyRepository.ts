import { PoolClient, QueryResult } from "pg";
import pool from "../../common/db/config";
import { Companies } from "../../domain/models/company";

export class CompanyRepository {
  private readonly db = pool;

  public async getAll(): Promise<Companies[]> {
    try {
      const query = `
                SELECT 
                    id,
                    name,
                    description,
                    created_at as "createdAt",
                    updated_at as "updatedAt"
                FROM pkl_companies`;
      const result: QueryResult<Companies> = await this.db.query(query);

      return result.rows;
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in CompanyRepository of getAll() method`
      );
    }
  }

  public async create(company: Companies): Promise<void> {
    const query = `
            INSERT INTO pkl_companies (
                name, description
            ) VALUES ($1, $2)
        `;

    try {
      const res = await this.db.query(query, [
        company.name,
        company.description,
      ]);
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in CompanyRepository of getAll() method`
      );
    }
  }

  public async getById(id: string): Promise<Companies | null> {
    try {
      const query = `
                SELECT
                    id,
                    name,
                    description,
                    created_at as "createdAt",
                    updated_at as "updatedAt"
                FROM pkl_companies
                WHERE id = '${id}'
            `;

      const result: QueryResult<Companies> = await this.db.query(query);

      return result.rows[0];
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in CompanyRepository of getAll() method`
      );
    }
  }
}
