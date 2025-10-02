import { QueryResult } from "pg";
import pool from "../../common/db/config";
import { Parking } from "../../domain/models/parking";
import { NewParkingsServices } from "../../domain/models/parkingServices";

export class ParkingRepository {
  private readonly db = pool;

  public async getAll(): Promise<Parking[]> {
    try {
      const query = `
                SELECT 
                    id,
                    country,
                    name,
                    ST_Y(location::geometry) AS latitude,
                    ST_X(location::geometry) AS longitude,
                    available_space AS "availableSpace",
                    id_status AS "idStatus",
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
                FROM pkl_parkings`;
      const result: QueryResult<Parking> = await this.db.query(query);

      return result.rows;
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in ParkingRepository of getAll() method`
      );
    }
  }

  public async getById(id: string): Promise<Parking | null> {
    try {
      const query = `
                SELECT 
                    id,
                    country,
                    name,
                    ST_Y(location::geometry) AS latitude,
                    ST_X(location::geometry) AS longitude,
                    available_space AS "availableSpace",
                    id_status AS "idStatus",
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
                FROM pkl_parkings
                WHERE id = $1
                `;
      const result: QueryResult<Parking> = await this.db.query(query, [id]);

      if (result.rows.length > 0) {
        return result.rows[0];
      }
      return null;
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in ParkingRepository of getById() method`
      );
    }
  }

  public async create(parking: Parking): Promise<void> {
    try {
      const query = `
                INSERT INTO pkl_parkings (
                    country, name,
                    address, available_space,
                    id_status, location)
                VALUES (
                    $1, $2,
                    $3, $4,
                    $5, ST_SetSRID(ST_MakePoint(${parking.longitude}, ${parking.latitude}), 4326))
            `;

      await this.db.query(query, [
        parking.country,
        parking.name,
        parking.address,
        parking.availableSpace,
        parking.idStatus,
      ]);
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message}, in ParkingRepository of create() method`
      );
    }
  }

  public async AddServiceToParking(pksvc: NewParkingsServices): Promise<void> {
    try {
      const query = `
                INSERT INTO pkl_parkings_services (
                    id_parking, id_service, id_status, price
                ) VALUES (
                    $1, $2, $3, $4
                );
            `;

      await this.db.query(query, [
        pksvc.id_parking,
        pksvc.id_service,
        pksvc.id_status,
        pksvc.price,
      ]);
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message}, in ParkingRepository of AddServiceToParking() method`
      );
    }
  }
}
