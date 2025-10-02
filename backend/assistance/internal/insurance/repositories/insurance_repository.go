package repositories

import (
	"fmt"
	"time"

	countryModel "bitbucket.org/mya/mya-assistance-core/internal/country/models"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type InsuranceRepository interface {
	Create(insurance *entities.Insurance) error
	GetAll() ([]entities.Insurance, error)
	GetByID(id uuid.UUID) (*entities.Insurance, error)
	Update(insurance *entities.Insurance) error
	GetByKey(key uint) (*entities.Insurance, error)
	GetByCountryID(countryID uuid.UUID) (*[]entities.Insurance, error)
	GetWithCountries(lang string) (*[]models.InsuranceWithCountries, error)
}

type insuranceRepository struct {
	db *sqlx.DB
}

func NewInsuranceRepository(db *sqlx.DB) InsuranceRepository {
	return &insuranceRepository{db: db}
}

func (r *insuranceRepository) Create(insurance *entities.Insurance) error {
	query := `
		INSERT INTO a_insurances (name, key) 
		VALUES (:name, :key)`
	_, err := r.db.NamedExec(query, insurance)
	return err
}

func (r *insuranceRepository) GetByID(id uuid.UUID) (*entities.Insurance, error) {
	var insurance entities.Insurance
	query := `SELECT id, name, key FROM a_insurances WHERE id = $1`
	err := r.db.Get(&insurance, query, id)
	if err != nil {
		return nil, err
	}
	return &insurance, nil
}

func (r *insuranceRepository) GetByKey(key uint) (*entities.Insurance, error) {
	var insurance entities.Insurance
	query := `SELECT id, name, key FROM a_insurances WHERE key = $1`
	err := r.db.Get(&insurance, query, key)
	if err != nil {
		return nil, err
	}
	return &insurance, nil
}

func (r *insuranceRepository) GetByCountryID(countryID uuid.UUID) (*[]entities.Insurance, error) {
	insurances := []entities.Insurance{}
	query := `
		SELECT i.id, i.name, i.key
		FROM a_insurances_countries ic
		JOIN a_insurances i ON i.id = ic.insurance_id
		WHERE ic.country_id = $1
		ORDER BY CASE WHEN i.key = 1 THEN 0 ELSE 1 END, i.name ASC`
	err := r.db.Select(&insurances, query, countryID)
	if err != nil {
		return nil, err
	}
	return &insurances, nil
}

func (r *insuranceRepository) Update(insurance *entities.Insurance) error {
	query := `
		UPDATE a_insurances 
		SET name = :name, key = :key
		WHERE id = :id`
	_, err := r.db.NamedExec(query, insurance)
	return err
}

func (r *insuranceRepository) Delete(id uuid.UUID) error {
	query := `
		UPDATE a_insurances 
		SET deleted_at = $1 
		WHERE id = $2`
	_, err := r.db.Exec(query, time.Now().Unix(), id)
	return err
}

func (r *insuranceRepository) GetAll() ([]entities.Insurance, error) {
	var insurances []entities.Insurance
	query := `
		SELECT id, name, key FROM a_insurances 
		ORDER BY CASE WHEN key = 1 THEN 0 ELSE 1 END, name ASC`
	err := r.db.Select(&insurances, query)
	if err != nil {
		return nil, err
	}
	return insurances, nil
}

func (r *insuranceRepository) GetWithCountries(lang string) (*[]models.InsuranceWithCountries, error) {
	query := `
		SELECT id, name, key, created_at, updated_at
		FROM a_insurances 
		ORDER BY CASE WHEN key = 1 THEN 0 ELSE 1 END, name ASC`

	var insuranceWithCountries []models.InsuranceWithCountries
	err := r.db.Select(&insuranceWithCountries, query)
	if err != nil {
		return nil, err
	}

	insuranceMap := make(map[uuid.UUID]*models.InsuranceWithCountries)
	for i := range insuranceWithCountries {
		insuranceMap[insuranceWithCountries[i].ID] = &insuranceWithCountries[i]
	}

	var countriesList []struct {
		InsuranceID uuid.UUID `db:"insurance_id"`
		CountryID   uuid.UUID `db:"id"`
		CountryName string    `db:"name"`
	}
	countriesQuery := fmt.Sprintf(`
		SELECT ic.insurance_id, c.id, c.%s as "name"
		FROM a_insurances_countries ic
		JOIN a_countries c ON ic.country_id = c.id`, lang)
	err = r.db.Select(&countriesList, countriesQuery)
	if err != nil {
		return nil, err
	}

	for _, row := range countriesList {
		insurance := insuranceMap[row.InsuranceID]
		if insurance.Countries == nil {
			insurance.Countries = &[]countryModel.Country{}
		}
		country := countryModel.Country{
			Name: row.CountryName,
		}
		country.ID = row.CountryID
		*insurance.Countries = append(*insurance.Countries, country)
	}

	return &insuranceWithCountries, nil
}
