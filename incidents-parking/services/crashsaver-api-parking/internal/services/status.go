package services

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/queries"
	"log"

	"github.com/jmoiron/sqlx"
)

type StatusService struct {
	db      *sqlx.DB
	queries *queries.StatusQuery
}

func NewStatusService(db *sqlx.DB) *StatusService {
	return &StatusService{
		db:      db,
		queries: &queries.StatusQuery{},
	}
}

func (ss *StatusService) GetList(lang string) ([]*data.BStatus, error) {
	var status []*data.BStatus

	query := ss.queries.GetAllStatus(lang)

	err := ss.db.Select(&status, query)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return status, nil
}

func (ss *StatusService) GetStatusEN(name string) (*data.BStatus, error) {
	var status data.BStatus
	err := ss.db.Get(&status, ss.queries.GetStatusByNameEN(), name)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &status, nil
}

func (ss *StatusService) GetStatusByKey(key string) (*data.BStatus, error) {
	var status data.BStatus
	err := ss.db.Get(&status, `SELECT id, en as "name", key, type FROM public.status WHERE LOWER(key) = LOWER($1)`, key)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &status, nil
}
