package queries

import "fmt"

type ParkingQuery struct{}

func (q *ParkingQuery) GetAllParkings() string {
	return `
        SELECT 
            id,
            country,
            name,
            address,
            emails,
            language,
            available_space as "availableSpace",
            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude
        FROM pkl_parkings
        ORDER BY created_at ASC`
}

// available_space,
func (q *ParkingQuery) GetParkingByID() string {
	return `
        SELECT 
            id,
            country,
            name,
            address,
            emails,
            language,
            available_space as "availableSpace",
            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude
        FROM pkl_parkings
        WHERE id = $1`
}

func (q *ParkingQuery) Create() string {
	return `
        INSERT INTO pkl_parkings (
            name, country, address, available_space, id_status, emails, 
            location, price, email, language
        ) VALUES (
            $1, $2, $3, $4, $5, $6,
            ST_SetSRID(ST_MakePoint($8, $7), 4326)
            , 0.00 , '', $9
        ) RETURNING id`
}

func (q *ParkingQuery) GetDataParkings(lang, clause string) string {
	return fmt.Sprintf(`
        SELECT 
            p.id,
            p.country,
            p.name,
            p.address,
            language,
            array_to_json(p.emails) AS emails,
            p.available_space AS "availableSpace",
            ST_Y(p.location::geometry) AS latitude,
            ST_X(p.location::geometry) AS longitude,
            (
                SELECT json_agg(s) 
                FROM (
                    SELECT 
                        svc.id as "id",
                        svc.key as "key",
                        svc.%[1]s as "name"
                    FROM 
                        pkl_parkings_services pks
                    JOIN 
                        pkl_services svc ON pks.id_service = svc.id
                    JOIN 
                        status st ON pks.id_status = st.id AND st.en = 'active'
                    WHERE 
                        pks.id_parking = p.id
                    ORDER BY svc.key ASC
                ) s
            ) AS services,
            (
                SELECT json_agg(h) 
                FROM (
                    SELECT 
                        pph.hours as "hours",
                        pph.price as "price"
                    FROM 
                        pkl_parkings_price_hours pph
                    WHERE 
                        pph.parking_id = p.id
                    ORDER BY pph.hours ASC
                ) h
            ) AS hours
        FROM 
            pkl_parkings p
        %[2]s
        GROUP BY 
            p.id
        ORDER BY 
            p.created_at ASC;
    `, lang, clause)
}
