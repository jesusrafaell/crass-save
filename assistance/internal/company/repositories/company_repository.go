package repositories

import (
	"log"

	"bitbucket.org/mya/mya-assistance-core/internal/company/models"
	userModel "bitbucket.org/mya/mya-assistance-core/pkg/users/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type CompanyRepository interface {
	Create(data *models.Company) error
	GetByID(id uuid.UUID) (*models.Company, error)
	GetByKey(key uint) (*models.Company, error)
	GetByName(name string) (*models.Company, error)
	GetAll() (*[]models.Company, error)
	Update(data *models.Company) error
	Delete(id uuid.UUID) error
	GetAllCompaniesInfo() (*[]models.CompanyInfo, error)
}

type companyRepository struct {
	db          *sqlx.DB
	priceKmBase float64
}

func NewCompanyRepository(database *sqlx.DB) CompanyRepository {
	return &companyRepository{
		db:          database,
		priceKmBase: 10.00, // Precio base por km
	}
}

func (r *companyRepository) Create(company *models.Company) error {
	query := `
		INSERT INTO u_companies 
		(name, description, email, mobile, active, location)
		VALUES ($1, $2, $3, $4, $5, POINT($6, $7))
		RETURNING id
	`

	log.Println(company.Location.Lat)

	_, err := r.db.Exec(query,
		company.Name,
		company.Description,
		company.Email,
		company.Mobile,
		company.Active,
		company.Location.Lat,
		company.Location.Lng,
	)

	if err != nil {
		log.Printf("Error inserting company: %v", err)
		return err
	}

	return nil
}

func (r *companyRepository) GetByID(id uuid.UUID) (*models.Company, error) {
	var company models.Company
	err := r.db.Get(&company, "SELECT id, name, key, description, email, mobile, active FROM u_companies WHERE id = $1", id)
	return &company, err
}

func (r *companyRepository) GetByKey(key uint) (*models.Company, error) {
	var company models.Company
	err := r.db.Get(&company, "SELECT id, name, key, description, email, mobile, active FROM u_companies WHERE key = $1", key)
	return &company, err
}

func (r *companyRepository) GetByName(name string) (*models.Company, error) {
	var company models.Company
	err := r.db.Get(&company, "SELECT id, name, key, description, email, mobile, active FROM u_companies WHERE lower(name) = lower($1)", name)
	return &company, err
}

func (r *companyRepository) GetAll() (*[]models.Company, error) {
	var companies []models.Company

	query := `
		SELECT id, name, "key", description, email, mobile, active,
			ST_Y(location::geometry) AS "location.latitude",
			ST_X(location::geometry) AS "locaiton.longitude"   
		FROM
			u_companies
		ORDER BY created_at DESC
	`

	err := r.db.Select(&companies, query)
	return &companies, err
}

func (r *companyRepository) Update(company *models.Company) error {
	_, err := r.db.NamedExec(`UPDATE u_companies SET 
		name = :name,
		description = :description,
		email = :email,
		mobile = :mobile,
		active = :active
		WHERE id = :id`, company)
	return err
}

func (r *companyRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec("DELETE FROM u_companies WHERE id = $1", id)
	return err
}

func (r *companyRepository) GetAllCompaniesInfo() (*[]models.CompanyInfo, error) {
	var roleDriver userModel.Roles
	err := r.db.Get(&roleDriver, "SELECT id, name, key, created_at, updated_at FROM roles WHERE key = 3")
	if err != nil {
		return nil, err
	}

	var companies []models.CompanyInfo
	query := `
        SELECT 
            c.id,
            c.name,
            c.description,
            c.key,
            c.email,
            c.mobile,
            c.active,
            c.created_at,
            c.updated_at,
            c.deleted_at,
            COUNT(DISTINCT CASE 
                WHEN u.company_id = c.id OR (u.company_id IS NULL AND c.key = 1) THEN u.id 
                ELSE NULL 
            END) AS total_user,
            COUNT(DISTINCT CASE 
                WHEN u.company_id = c.id AND $1 = ANY (u.roles_id) OR (u.company_id IS NULL AND c.key = 1 AND $2 = ANY (u.roles_id)) THEN u.id 
                ELSE NULL 
            END) AS total_driver
        FROM 
            public.u_companies c
        LEFT JOIN 
            public.u_users u ON u.company_id = c.id OR u.company_id IS NULL
        GROUP BY 
            c.id
		ORDER BY 
		c.created_at DESC;
    `

	err = r.db.Select(&companies, query, roleDriver.ID, roleDriver.ID)
	if err != nil {
		return nil, err
	}

	return &companies, nil
}
