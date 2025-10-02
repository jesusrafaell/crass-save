package queries

import (
	"fmt"
	"strings"
)

type BookingQuery struct{}

func (bq *BookingQuery) GetWithData(lang string, filterStatus []string, conditions string) string {
	var allowedStatus string
	if len(filterStatus) > 0 {
		// Prepara la cláusula IN para los estados permitidos
		listStatus := "'" + strings.Join(filterStatus, "','") + "'"
		allowedStatus = fmt.Sprintf("AND st.en IN (%s)", listStatus)
	}

	query := fmt.Sprintf(`
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
            json_build_object(
                'id', p.id,
                'name', p.name,
                'country', p.country,
                'latitude', ST_Y(p.location::geometry),
                'longitude', ST_X(p.location::geometry)
            ) AS parking,
            json_build_object(
                'id', c.id,
                'name', c.name,
                'description', c.description
            ) AS company,
            json_build_object(
                'id', st.id,
                'key', st.key,
                'name', st.%[1]s
            ) AS status,
            (
                SELECT json_agg(s) 
                FROM (
                    SELECT
                        s.id,
                        s.%[1]s as name,
                        s.key as "key"
                    FROM public.pkl_parkings_services pps
                    JOIN pkl_services s ON pps.id_service = s.id
                    WHERE pps.id_parking = b.id_parking
                    ORDER BY s.key ASC
                ) s
            ) AS services,
            b.created_at as "createdAt",
            b.updated_at as "updatedAt"
        FROM pkl_bookings b
        JOIN pkl_parkings p ON b.id_parking = p.id
        JOIN pkl_companies c ON b.id_company = c.id
        JOIN status st ON b.id_status = st.id %[2]s
        %[3]s
        ORDER BY b.created_at DESC;
        `, lang, allowedStatus, conditions)

	return query
}

func (bq *BookingQuery) Create() string {
	return `
	  INSERT INTO pkl_bookings (
	        init_time, end_time, hours,
	        license_plate, lp_container, price,
	        description, id_user, id_company,
	        id_parking, id_driver, id_status
	      ) VALUES (
	        $1, $2, $3,
	        $4, $5, $6,
	        $7, $8, $9,
	        $10, $11, $12
	      ) RETURNING id`
}

func (bq *BookingQuery) Update(conditions string) string {
	return `
        UPDATE pkl_bookings SET 
            updated_at = $1
            %[1]s 
        WHERE id = $2`
}

func (bq *BookingQuery) Asignate() string {
	return `
        UPDATE pkl_bookings SET 
            updated_at = :updatedAt,
            id_driver = :driverId
        WHERE license_plate = :licensePlate AND id_driver IS NULL`
}

func (bq *BookingQuery) AsignateByBooking() string {
	return `
        UPDATE pkl_bookings SET 
            updated_at = :updatedAt,
            id_driver = :driverId
        WHERE id = :bookingId
    `
}

func (bq *BookingQuery) AsignateById() string {
	return `
        UPDATE pkl_bookings SET 
            updated_at = :updatedAt,
            id_driver = :driverId
        WHERE id = :id AND id_driver IS NULL`
}

func (bq *BookingQuery) GetCountByDriverId(filterStatus []string) string {
	var allowedStatus string
	if len(filterStatus) > 0 {
		// Prepara la cláusula IN para los estados permitidos
		listStatus := "'" + strings.Join(filterStatus, "','") + "'"
		allowedStatus = fmt.Sprintf("AND st.en IN (%s)", listStatus)
	}

	query := fmt.Sprintf(`
        SELECT 
            COUNT(b.id) as "length"
        FROM pkl_bookings b
        JOIN status st ON b.id_status = st.id %[1]s
        WHERE b.id_driver = $1`, allowedStatus)

	return query
}

func (bq *BookingQuery) GetWithDataUser(lang string, filterStatus []string, conditions string) string {
	var allowedStatus string
	if len(filterStatus) > 0 {
		// Prepara la cláusula IN para los estados permitidos
		listStatus := "'" + strings.Join(filterStatus, "','") + "'"
		allowedStatus = fmt.Sprintf("AND st.en IN (%s)", listStatus)
	}
	unassignedText := "Unassigned"
	if lang == "es" {
		unassignedText = "Sin asignar"
	} else if lang == "fr" {
		unassignedText = "Non attribué"

	}

	query := fmt.Sprintf(`
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
            CASE 
            WHEN b.id_driver IS NOT NULL 
                THEN
                    json_build_object(
                        'id',au.id,
                        'name', au.first_name || ' ' || au.last_name,
                        'email', au.email,
                        'mobile', au.mobile
                    ) 
                ELSE
                    null
                END	AS driver,
            CASE 
                WHEN b.id_driver IS NOT NULL 
                    THEN au.first_name || ' ' || au.last_name
                    ELSE '%[4]s'
                END as "fullNameDriver",
            json_build_object(
                'id', p.id,
                'name', p.name,
                'country', p.country,
                'latitude', ST_Y(p.location::geometry),
                'longitude', ST_X(p.location::geometry)
            ) AS parking,
            json_build_object(
                'id', c.id,
                'name', c.name,
                'description', c.description
            ) AS company,
            json_build_object(
                'id', st.id,
                'key', st.key,
                'name', st.%[1]s
            ) AS status,
            (
                SELECT json_agg(s) 
                FROM (
                    SELECT
                        s.id,
                        s.%[1]s as name,
                        s.key as "key"
                    FROM public.pkl_parkings_services pps
                    JOIN pkl_services s ON pps.id_service = s.id
                    WHERE pps.id_parking = b.id_parking
                    ORDER BY s.key ASC
                ) s
            ) AS services,
            b.created_at as "createdAt",
            b.updated_at as "updatedAt"
        FROM pkl_bookings b
        LEFT JOIN auth_users au ON au.id = b.id_driver
        JOIN pkl_parkings p ON b.id_parking = p.id
        JOIN pkl_companies c ON b.id_company = c.id
        JOIN status st ON b.id_status = st.id %[2]s
        %[3]s
        ORDER BY b.created_at DESC;
        `, lang, allowedStatus, conditions, unassignedText)

	return query
}

func (bq *BookingQuery) Get() string {
	return `
        SELECT 
            id,
            hours,
            price,
            description,
            license_plate as "licensePlate",
            lp_container  as "lpContainer",
            init_time     as "initTime",
            end_time      as "endTime",
            id_user       as "userId",
            id_driver     as "driverId",
            id_parking    as "parkingId",
            id_company    as "companyId",
            id_status     as "statusId",
            b.created_at  as "createdAt",
            b.updated_at  as "updatedAt"
        FROM pkl_bookings b`
}
