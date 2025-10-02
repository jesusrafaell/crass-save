import { QueryResult } from "pg";
import pool from "../../common/db/config";
import {
  NewService,
  ParkingSVC,
  Services,
} from "../../domain/models/parkingServices";

export class ServicesRepository {
  private readonly db = pool;

  public async getAll(lang: string): Promise<Services[]> {
    try {
      const query = `
                SELECT 
                    id,
                    ${lang} as "name",
                    "key",
                    created_at as "createdAt",
                    updated_at as "updatedAt"
                FROM pkl_services`;
      const result: QueryResult<Services> = await this.db.query(query);

      return result.rows;
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in ServicesRepository of getAll() method`
      );
    }
  }

  public async create(svc: NewService): Promise<void> {
    const query = `
            INSERT INTO pkl_services (
                key, en, es
            ) VALUES (
                $1, $2, $3
            )
        `;

    try {
      await this.db.query(query, [svc.key, svc.en, svc.es]);
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in ServicesRepository of create() method`
      );
    }
  }

  public async getByParkingId(
    parkingId: string,
    lang: string
  ): Promise<ParkingSVC[]> {
    try {
      const query = `
                SELECT 
                    svc.id as "id",
                    svc.key as "key",
                    svc.${lang} as "name",
                    pks.price,
                    st.${lang} as "status",
                    pks.id_status as "idStatus"
                FROM 
                    pkl_parkings_services pks
                INNER JOIN 
                    pkl_services svc ON pks.id_service = svc.id
                INNER JOIN 
                    status st ON pks.id_status = st.id
                WHERE 
                    pks.id_parking = $1
                ORDER BY svc.created_at ASC;
            `;

      const res: QueryResult<ParkingSVC> = await this.db.query(query, [
        parkingId,
      ]);

      return res.rows;
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message}, in ParkingRepository of getservicesByParkingId() method`
      );
    }
  }
}
