package services

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/queries"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type LicensePlateXCompanyService struct {
	db      *sqlx.DB
	queries *queries.LicensePlateXCompanyQuery
}

func NewLicensePlateXCompanyService(db *sqlx.DB) *LicensePlateXCompanyService {
	return &LicensePlateXCompanyService{
		db:      db,
		queries: &queries.LicensePlateXCompanyQuery{},
	}
}

func (lxcs *LicensePlateXCompanyService) Create(licensePlateXCompany *data.LicensePlateXCompany) error {
	var id uuid.UUID
	err := lxcs.db.QueryRow(
		lxcs.queries.Create(),
		licensePlateXCompany.LicensePlate,
		licensePlateXCompany.CompanyId,
	).Scan(&id)
	if err != nil {
		return err
	}
	return nil
}

func (lxcs *LicensePlateXCompanyService) ListByCompanyId(companyId uuid.UUID) ([]*data.LicensePlateXCompany, error) {

	var results []*data.LicensePlateXCompany
	err := lxcs.db.Select(&results, lxcs.queries.ListByCompanyId(), companyId)
	if err != nil {
		return nil, err
	}

	return results, nil
}
