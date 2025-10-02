package repositories

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/country/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type CountryRepository interface {
	GetByID(id uuid.UUID, lang string) (*models.Country, error)
	GetByName(name string, lang string) (*models.Country, error)
	Create(data *models.Country) error
	GetAll(lang string) (*[]models.Country, error)
	Update(data *models.Country) error
	Delete(id uuid.UUID) error
	GetByKey(lang string, key uint) (*models.Country, error)
}

type countryRepository struct {
	db *sqlx.DB
}

func NewCountryRepository(db *sqlx.DB) CountryRepository {
	return &countryRepository{db: db}
}

func (r *countryRepository) GetByID(id uuid.UUID, lang string) (*models.Country, error) {
	var country models.Country
	query := fmt.Sprintf("SELECT id, %s as name FROM a_countries WHERE id = $1", lang)

	err := r.db.Get(&country, query, id)
	if err != nil {
		return nil, err
	}
	return &country, nil
}

func (r *countryRepository) GetByName(name string, lang string) (*models.Country, error) {
	var country models.Country
	query := fmt.Sprintf("SELECT id, %s as name FROM a_countries WHERE %s = $1", lang, lang)

	err := r.db.Get(&country, query, name)
	if err != nil {
		return nil, err
	}
	return &country, nil
}

// Crear un nuevo país
func (r *countryRepository) Create(data *models.Country) error {
	_, err := r.db.NamedExec(`INSERT INTO a_countries (en, es) VALUES (:en, :es)`, data)
	return err
}

func (r *countryRepository) GetAll(lang string) (*[]models.Country, error) {
	var countries []models.Country
	query := fmt.Sprintf("SELECT id, %s as name FROM a_countries ORDER BY %s ASC", lang, lang)

	err := r.db.Select(&countries, query)
	if err != nil {
		return nil, err
	}
	return &countries, nil
}

func (r *countryRepository) Update(data *models.Country) error {
	_, err := r.db.NamedExec(`UPDATE a_countries SET en = :en, es = :es WHERE id = :id`, data)
	return err
}

func (r *countryRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec("DELETE FROM a_countries WHERE id = $1", id)
	return err
}

func (r *countryRepository) GetByKey(lang string, key uint) (*models.Country, error) {
	var country models.Country
	query := fmt.Sprintf("SELECT id, %s as name FROM a_countries WHERE key = $1", lang)

	err := r.db.Get(&country, query, key)
	if err != nil {
		return nil, err
	}
	return &country, nil
}
