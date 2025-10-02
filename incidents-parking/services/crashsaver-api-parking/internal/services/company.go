package services

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/queries"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type CompanyService struct {
	db      *sqlx.DB
	queries *queries.CompanyQuery
}

func NewCompanyService(db *sqlx.DB) *CompanyService {
	return &CompanyService{
		db:      db,
		queries: &queries.CompanyQuery{},
	}
}

func (cs *CompanyService) Create(company *data.Company) error {
	var id uuid.UUID
	err := cs.db.QueryRow(
		cs.queries.CreateCompany(),
		company.Name,
		company.Description,
		company.Email,
	).Scan(&id)
	if err != nil {
		return err
	}

	return nil
}

func (cs *CompanyService) GetByID(id uuid.UUID) (*data.Company, error) {
	var company data.Company
	err := cs.db.Get(&company, cs.queries.GetCompanyByID(), id)
	if err != nil {
		return nil, err
	}

	return &company, nil
}

func (cs *CompanyService) ListCompanies() ([]*data.Company, error) {
	var companies []*data.Company
	err := cs.db.Select(&companies, cs.queries.GetListCompanies())
	if err != nil {
		return nil, err
	}

	return companies, nil
}

func (cs *CompanyService) Update(id uuid.UUID, company *data.CompanyUpdate) error {
	var setClauses []string
	var args []interface{}

	if company.Credits != nil {
		setClauses = append(setClauses, fmt.Sprintf("credits = $%d", len(setClauses)+1))
		args = append(args, *company.Credits)
	}

	if len(setClauses) == 0 {
		return fmt.Errorf("no fields to update")
	}

	query := fmt.Sprintf(`
		UPDATE pkl_companies 
		SET updated_at = %d,
		%s 
		WHERE id = '%s'`,
		time.Now().Unix(), strings.Join(setClauses, ", "), id)
	_, err := cs.db.Exec(query, args...)
	if err != nil {
		return err
	}
	return nil
}

func (cs *CompanyService) operationCredits(id uuid.UUID, credits float64, sum bool) error {
	//true = sumar
	//false = less

	operation := "credits = credits + $1"
	if !sum {
		operation = "credits = credits - $1"
	}

	query := fmt.Sprintf(`
		UPDATE pkl_companies 
		SET updated_at = $2,
		%s 
		WHERE id = $3`, operation)

	_, err := cs.db.Exec(query, credits, time.Now().Unix(), id)
	if err != nil {
		return err
	}
	return nil
}
