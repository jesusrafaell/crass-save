import { QueryResult } from "pg";
import pool from "../../../../common/db/config/configPosgre";
import { UserBase, UserXParking } from "../../domain/models/user";
import { ParkingDto } from "../../domain/models/truck/parkinglot";

export class UserXParkingRepository {
  private readonly db = pool;

  public async getParkingByUserId(userId: string): Promise<ParkingDto | null> {
    try {
      const query = `
				SELECT
					p.id AS "id",
					p.country AS "country",
					p.name AS "name",
					p.address AS "address",
					ST_Y(p.location::geometry) AS latitude,
          ST_X(p.location::geometry) AS longitude,
					p.available_space as "availableSpace"
				FROM userxparking up
				JOIN public.pkl_parkings p ON p.id = up.id_parking
        WHERE up.id_user = $1
			`;
      const result: QueryResult<ParkingDto> = await this.db.query(query, [
        userId,
      ]);
      if (result.rows.length < 0) return null;

      return result.rows[0];
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }

  public async getUsersByParkingId(id: string): Promise<UserBase[]> {
    try {
      const query = `
				SELECT
          u.id as id,
          u.email as email
				FROM userxparking up
        JOIN auth_users u ON up.id_user = u.id
        Where up.id_parking = $1
			`;
      const result: QueryResult<UserBase> = await this.db.query(query, [id]);

      return result.rows;
    } catch (error) {
      const _error = error as Error;
      throw _error;
    }
  }
}
