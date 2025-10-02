import { User, UserUpdate } from "../../domain/models/user";
import { QueryResult } from "pg";
import pool from "../../../../common/db/config/configPosgre";
import { queryDataUser } from "../utils/queryGetDataUser";
import listCodeErrors from "../../../../common/utils/listCodeErrors";
import { nativeCurrentUnixTime } from "../../../../common/utils/unixTime";

export class UserRepository {
  private readonly db = pool;

  public async create(user: User): Promise<{ id: string }> {
    try {
      const insertQuery = `
				INSERT INTO auth_users (
					first_name, last_name, email, password,
					mobile, distance_radius, utc, fcm_token,
					guest, id_os, id_status, id_transport_type,
					id_auth_roles
				) VALUES (
					$1, $2, $3,
					$4, $5, $6,
					$7, $8, $9,
					$10, $11, $12,
					$13
				) RETURNING id
			`;

      const values: any[] = [
        user.first_name,
        user.last_name,
        user.email,
        user.password,
        user.mobile,
        user.distance_radius,
        user.utc,
        user.fcm_token,
        user.guest,
        user.id_os,
        user.id_status,
        user.id_transport_type,
        user.id_roles ? `{${user.id_roles.join(",")}}` : null,
      ];

      const result: QueryResult<{ id: string }> = await this.db.query(
        insertQuery,
        values
      );

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getAll(): Promise<User[]> {
    try {
      const result: QueryResult<User> = await this.db.query(
        queryDataUser(undefined, undefined)
      );

      if (result.rows.length < 0) return [];

      return result.rows;
    } catch (error) {
      console.log(error);
      const _error = error as Error;
      throw _error;
    }
  }

  public async getDataById(userId: string): Promise<User | null> {
    try {
      const query = queryDataUser(userId);

      const result: QueryResult<User> = await this.db.query(query);

      if (result.rows.length < 1) return null;

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getById(userId: string): Promise<User | null> {
    try {
      const query = `SELECT * FROM auth_users WHERE id = $1 `;

      const result: QueryResult<User> = await this.db.query(query, [userId]);

      if (result.rows.length < 1) return null;

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getByEmail(email: string): Promise<User | null> {
    try {
      const query = queryDataUser(undefined, email);
      const result: QueryResult<User> = await this.db.query(query);

      if (result.rows.length < 1) return null;

      return result.rows[0];
    } catch (error) {
      console.log(error);
      const _error = error as Error;
      throw _error;
    }
  }

  public async getByMobile(mobile: string) {
    try {
      const query = `SELECT * FROM auth_users where mobile = $1 `;
      const result: QueryResult<User> = await this.db.query(query, [mobile]);

      if (result.rows.length < 0) return null;

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getaByIds(userIds: string[]): Promise<User[] | []> {
    try {
      //list params
      const params = userIds.map((_, index) => `$${index + 1}`).join(", ");

      //sql with params
      const query = `SELECT * FROM auth_users WHERE id IN (${params})`;

      const result: QueryResult<User> = await this.db.query(query, userIds);

      return result.rows;
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async updateUser(user: UserUpdate) {
    try {
      let query = `UPDATE auth_users SET updated_at = ${nativeCurrentUnixTime()}`;
      const values: any[] = [];
      let counter = 1;

      if (user.first_name) {
        values.push(user.first_name);
        query += `, first_name = $${counter++}`;
      }
      if (user.last_name) {
        values.push(user.last_name);
        query += `, last_name = $${counter++}`;
      }

      if (user.fcm_token != undefined) {
        values.push(user.fcm_token === "" ? null : user.fcm_token);
        query += `, fcm_token = $${counter++}`;
      }

      if (user.id_status) {
        values.push(user.id_status);
        query += `, id_status = $${counter++}`;
      }
      if (user.mobile) {
        values.push(user.mobile);
        query += `, mobile = $${counter++}`;
      }
      if (user.distance_radius) {
        values.push(user.distance_radius);
        query += `, distance_radius = $${counter++}`;
      }
      if (user.utc) {
        values.push(user.utc);
        query += `, utc = $${counter++}`;
      }
      if (user.id_os) {
        values.push(user.id_os);
        query += `, id_os = $${counter++}`;
      }
      if (user.id_transport_type) {
        values.push(user.id_transport_type);
        query += `, id_transport_type = $${counter++}`;
      }
      if (user.password) {
        values.push(user.password);
        query += `, password = $${counter++}`;
      }

      // add userId
      values.push(user.id);
      query += ` WHERE id = $${counter}`;

      const result = await this.db.query(query, values);

      if (result.rowCount == 0) {
        throw new Error(listCodeErrors.userNotFound.code);
      }
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getRolByIdUser(id: string) {
    try {
      //primero validar si existe el usuario con email
      const query = `
				SELECT ar.name
				FROM auth_roles ar
				JOIN (
					SELECT unnest(id_auth_roles) AS role_id
					FROM auth_users
					WHERE id = '${id}'
				) AS user_roles ON ar.id = user_roles.role_id
			`;
      const result = await this.db.query(query);

      if (result.rows.length < 1)
        throw new Error(listCodeErrors.userNotFound.code);

      return result.rows;
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async deleteDataUser(userId: string, id_status: string) {
    try {
      const inset = `
				UPDATE auth_users
				SET deleted_at = ${nativeCurrentUnixTime()}
					,distance_radius = 0
					,password = null
					,fcm_token = null
					,first_name = null
					,last_name = null
					,email = null
					,id_status = '${id_status}'
					,mobile = null
					,id_auth_identification = null
				WHERE id = '${userId}'
			`;

      await this.db.query(inset);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async delete(userId: string) {
    try {
      const queryText = "DELETE FROM auth_users WHERE id = $1";
      await this.db.query(queryText, [userId]);
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getByFCM(fcm: string): Promise<User | null> {
    try {
      const query = `SELECT * FROM auth_users WHERE fcm_token = $1`;

      const result: QueryResult<User> = await this.db.query(query, [fcm]);

      if (result.rows.length < 1) return null;

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async addRole(userId: string, roleId: string): Promise<void> {
    const query = `
        UPDATE auth_users u
        SET id_auth_roles = array_append(id_auth_roles, $2)
        WHERE u.id = $1;
    `;

    const result = await this.db.query(query, [userId, roleId]);

    if (result.rowCount == 0) {
      throw new Error(listCodeErrors.userNotFound.code);
    }
  }
}
