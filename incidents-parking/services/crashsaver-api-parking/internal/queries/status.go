package queries

import (
	"fmt"
)

type StatusQuery struct{}

func (q *StatusQuery) GetAllStatus(lang string) string {
	query := fmt.Sprintf(`
		SELECT 
			id, 
			%[1]s as "name",
			key,
			type
		FROM public.status
	`, lang)

	return query
}

func (q *StatusQuery) GetStatusByNameEN() string {
	return `
		SELECT 
			id, 
			en as "name",
			key,
			type
		FROM public.status
		WHERE en = $1`
}
