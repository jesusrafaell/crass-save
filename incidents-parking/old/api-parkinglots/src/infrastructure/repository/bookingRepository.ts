import { QueryResult } from "pg";
import pool from "../../common/db/config";
import { Booking, BookingUpdate } from "../../domain/models/booking";
import { FilterBooking } from "../../application/controllers/booking.controller";
import { nativeCurrentUnixTime } from "../../common/utils/unixTime";
import { queryBookingData } from "./utils/queryBookingData";

export class BookingRepository {
  private readonly db = pool;
  private readonly statusOn = ["active", "pending", "processing"];

  public async getAll(lang: string, op: FilterBooking): Promise<Booking[]> {
    try {
      const filterStatus: string[] = op.all ? [] : this.statusOn;

      let query = `${queryBookingData(lang, filterStatus)}`;
      const queryParams = [];
      const conditions = [];
      if (op.licensePlate) {
        queryParams.push(op.licensePlate);
        conditions.push(`b.license_plate = $${queryParams.length}`);
      }
      if (op.userId) {
        queryParams.push(op.userId);
        conditions.push(`b.id_user = $${queryParams.length}`);
      }
      if (op.parkingId) {
        queryParams.push(op.parkingId);
        conditions.push(`b.id_parking = $${queryParams.length}`);
      }
      if (op.driverId) {
        queryParams.push(op.driverId);
        conditions.push(`b.id_driver = $${queryParams.length}`);
      }
      if (op.companyId) {
        queryParams.push(op.companyId);
        conditions.push(`b.id_company = $${queryParams.length}`);
      }
      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      const result: QueryResult<Booking> = await this.db.query(
        query,
        queryParams
      );

      return result.rows;
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in BookingRepository of getAll() method`
      );
    }
  }

  public async getByDriverId(
    driverId: string,
    lang: string,
    all?: boolean
  ): Promise<Booking[]> {
    try {
      const filterStatus: string[] = all ? [] : this.statusOn;

      let query = `${queryBookingData(
        lang,
        filterStatus
      )} WHERE b.id_driver = $1`;

      const result: QueryResult<Booking> = await this.db.query(query, [
        driverId,
      ]);

      return result.rows;
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in BookingRepository of getByDriver() method`
      );
    }
  }

  public async create(booking: Booking): Promise<void> {
    const query = `
      INSERT INTO pkl_bookings (
        init_time, end_time, hours,
        license_plate, lp_container, price,
        description, id_user, id_company,
        id_parking, id_driver, id_status,
        id_services
      ) VALUES (
        $1, $2, $3,
        $4, $5, $6,
        $7, $8, $9,
        $10, $11, $12,
        $13
      )
    `;

    const servicesIdString = `{${booking.serviceIds.join(",")}}`;

    const values = [
      booking.initTime,
      booking.endTime,
      booking.hours,
      booking.licensePlate,
      booking.lpContainer,
      booking.price,
      booking.description,
      booking.userId,
      booking.companyId,
      booking.parkingId,
      booking.driverId,
      booking.statusId,
      servicesIdString,
    ];

    try {
      await this.db.query(query, values);
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in BookingRepository of create() method`
      );
    }
  }

  public async update(id: string, booking: BookingUpdate): Promise<void> {
    try {
      let query = `UPDATE pkl_bookings SET updated_at = ${nativeCurrentUnixTime()}`;
      const values = [];
      let counter = 1;

      if (booking.licensePlate) {
        values.push(booking.licensePlate);
        query += `, license_plate = $${counter++}`;
      }

      if (booking.lpContainer) {
        values.push(booking.lpContainer);
        query += `, lp_container = $${counter++}`;
      }

      if (booking.description) {
        values.push(booking.description);
        query += `, description = $${counter++}`;
      }

      if (booking.initTime) {
        values.push(booking.initTime);
        query += `, init_time = $${counter++}`;
      }

      if (booking.endTime) {
        values.push(booking.endTime);
        query += `, end_time = $${counter++}`;
      }

      if (booking.hours) {
        values.push(booking.hours);
        query += `, hours = $${counter++}`;
      }

      if (booking.price) {
        values.push(booking.price);
        query += `, price = $${counter++}`;
      }

      if (booking.userId) {
        values.push(booking.userId);
        query += `, id_user = $${counter++}`;
      }

      if (booking.driverId) {
        values.push(booking.driverId);
        query += `, id_driver = $${counter++}`;
      }

      if (booking.parkingId) {
        values.push(booking.parkingId);
        query += `, id_parking = $${counter++}`;
      }

      if (booking.companyId) {
        values.push(booking.companyId);
        query += `, id_company = $${counter++}`;
      }

      if (booking.statusId) {
        values.push(booking.statusId);
        query += `, id_status = $${counter++}`;
      }

      if (booking.serviceIds) {
        const servicesIdString = `{${booking.serviceIds.join(",")}}`;
        values.push(servicesIdString);
        query += `, id_services = $${counter++}`;
      }

      //add booking id
      values.push(id);
      query += ` WHERE id = $${counter}`;

      await this.db.query(query, values);
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in BookingRepository of update() method`
      );
    }
  }

  public async getCountByDriverId(driveId: string): Promise<number> {
    try {
      const filterStatus = `AND st.en IN ('${this.statusOn.join("','")}')`;
      let query = `
        SELECT COUNT(b.id) as total
          FROM pkl_bookings b
        JOIN status st ON b.id_status = st.id ${filterStatus}
        WHERE b.id_driver = $1
      `;
      const result: QueryResult<{ total: number }> = await this.db.query(
        query,
        [driveId]
      );

      if (!result.rows.length) {
        return 0;
      } else {
        return result.rows[0].total;
      }
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in BookingRepository of getCount() method`
      );
    }
  }

  public async getListByLicensePlate(licensePlate: string): Promise<Booking[]> {
    try {
      const allowedStatus = `AND st.en IN ('${this.statusOn.join("','")}')`;

      const query = `
        SELECT 
            b.id as id,
            b.license_plate as "licensePlate",
            b.lp_container as "lpContainer",
            b.description,
            b.init_time as "initTime",
            b.end_time as "endTime",
            b.hours,
            b.price,
            b.id_user as "userId",
            b.id_driver as "driverId",
            b.id_parking as "parkingId",
            b.id_company as "companyId",
            b.id_status as "statusId",
            json_build_object(
                'id', st.id,
                'name', st.en
            ) AS status,
            b.id_services as "serviceIds",
            b.created_at as "createdAt",
            b.updated_at as "updatedAt"
        FROM pkl_bookings b
        JOIN status st ON b.id_status = st.id ${allowedStatus} 
        WHERE b.license_plate = $1
			`;

      const result: QueryResult<Booking> = await this.db.query(query, [
        licensePlate,
      ]);

      return result.rows;
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in BookingRepository of getLicensePlate() method`
      );
    }
  }
  public async getById(id: string): Promise<Booking | null> {
    try {
      const query = `
        SELECT 
            b.id as id,
            b.license_plate as "licensePlate",
            b.lp_container as "lpContainer",
            b.description,
            b.init_time as "initTime",
            b.end_time as "endTime",
            b.hours,
            b.price,
            b.id_user as "userId",
            b.id_driver as "driverId",
            b.id_parking as "parkingId",
            b.id_company as "companyId",
            b.id_status as "statusId",
            b.id_services as "serviceIds",
            b.created_at as "createdAt",
            b.updated_at as "updatedAt"
        FROM pkl_bookings b
        WHERE b.id = $1
			`;

      const result: QueryResult<Booking> = await this.db.query(query, [id]);

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      const _err = err as Error;
      throw new Error(
        `${_err.message} in BookingRepository of getById() method`
      );
    }
  }
}
