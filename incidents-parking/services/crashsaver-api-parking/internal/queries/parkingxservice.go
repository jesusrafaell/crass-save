package queries

import (
	"fmt"
)

type PKServicesQuery struct{}

// $1 = parkingId , status = active
func (q *PKServicesQuery) GetServicesByParking(lang string) string {
	return fmt.Sprintf(`
        SELECT 
            svc.id as "id",
            svc.key as "key",
            svc.%[1]s as "name"
        FROM 
            pkl_parkings_services pks
        INNER JOIN 
            pkl_services svc ON pks.id_service = svc.id
        INNER JOIN 
            status st ON pks.id_status = st.id AND st.en = 'active'
        WHERE 
            pks.id_parking = $1
        ORDER BY svc.key ASC;
    `, lang)
}

func (q *PKServicesQuery) GetAll(lang string) string {
	return fmt.Sprintf(`
        SELECT 
            id as "id",
            key as "key",
            %[1]s as "name"
        FROM pkl_services 
        ORDER BY key ASC;
    `, lang)
}

func (q *PKServicesQuery) CreateService() string {
	return `
        INSERT INTO pkl_services (
            key, en, es
        ) VALUES (
            $1, $2, $3
        ) RETURNING id
    `
}
