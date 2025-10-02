export const queryBookingData = (
  lang: string,
  filterStatus: string[]
): string => {
  const allowedStatus = filterStatus.length
    ? `AND st.en IN ('${filterStatus.join("','")}')`
    : "";
  // : "'inactive', 'complete', 'cancelled', 'suspended', 'finished';
  return `
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
            json_build_object(
                'id', p.id,
                'name', p.name,
                'latitude', ST_Y(p.location::geometry),
                'longitude', ST_X(p.location::geometry)
            ) AS parking,
            b.id_company as "companyId",
            json_build_object(
                'id', c.id,
                'name', c.name,
                'description', c.description
            ) AS company,
            b.id_status as "statusId",
            json_build_object(
                'id', st.id,
                'name', st.${lang}
            ) AS status,
            b.id_services as "serviceIds",
            (
                SELECT json_agg(s) 
                FROM (
                    SELECT
                        p.id,
                        p.${lang} as name,
                        p.key as "key"
                    FROM pkl_services p 
                    WHERE p.id = ANY(b.id_services)
                ) s
            ) AS services,
            b.created_at as "createdAt",
            b.updated_at as "updatedAt"
        FROM pkl_bookings b
        JOIN pkl_parkings p ON b.id_parking = p.id
        JOIN pkl_companies c ON b.id_company = c.id
        JOIN status st ON b.id_status = st.id ${allowedStatus}
    `;
};
