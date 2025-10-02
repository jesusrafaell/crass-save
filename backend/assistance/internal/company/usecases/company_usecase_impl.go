package usecases

import (
	"context"
	"database/sql"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/company/models"
	"bitbucket.org/mya/mya-assistance-core/internal/company/repositories"
	"bitbucket.org/mya/mya-assistance-core/types"

	"github.com/google/uuid"
)

type CompanyUsecase interface {
	Create(ctx context.Context, company *models.CreateCompany) *apierrors.CustomError
	GetAll(ctx context.Context) (*[]models.Company, error)
	GetByID(ctx context.Context, id uuid.UUID) (*models.Company, *apierrors.CustomError)
	Update(ctx context.Context, id uuid.UUID, company *models.Company) *apierrors.CustomError
	GetByKey(ctx context.Context, key uint) (*models.Company, *apierrors.CustomError)
	GetAllInfo(ctx context.Context) (*[]models.CompanyInfo, error)
}

type companyUsecaseImpl struct {
	companyRepository repositories.CompanyRepository
}

func NewCompanyUsecaseImpl(companyRepository repositories.CompanyRepository) CompanyUsecase {
	return &companyUsecaseImpl{
		companyRepository: companyRepository,
	}
}

func (u *companyUsecaseImpl) Create(ctx context.Context, company *models.CreateCompany) *apierrors.CustomError {
	existCompany, err := u.companyRepository.GetByName(company.Name)
	if err != nil {
		if err != sql.ErrNoRows {
			return &apierrors.ErrorServer
		}
	}

	if existCompany != nil {
		return &apierrors.Duplicate
	}

	if err := u.companyRepository.Create(&models.Company{
		Name:        company.Name,
		Description: company.Description,
		Email:       company.Email,
		Mobile:      company.Mobile,
		Active:      true,
		Location: &types.Location{
			Lat: company.Location.Lat,
			Lng: company.Location.Lng,
		},
	}); err != nil {
		return &apierrors.ErrorServer
	}
	return nil
}

func (u *companyUsecaseImpl) GetAll(ctx context.Context) (*[]models.Company, error) {
	companies, err := u.companyRepository.GetAll()
	if err != nil {
		return nil, err
	}
	return companies, nil
}

func (u *companyUsecaseImpl) GetByID(ctx context.Context, id uuid.UUID) (*models.Company, *apierrors.CustomError) {
	company, err := u.companyRepository.GetByID(id)
	if err != nil {
		return nil, &apierrors.CompanyNotFound
	}
	return company, nil
}

func (u *companyUsecaseImpl) Update(ctx context.Context, id uuid.UUID, company *models.Company) *apierrors.CustomError {
	company.ID = id
	if err := u.companyRepository.Update(company); err != nil {
		return &apierrors.CompanyNotFound
	}
	return nil
}

func (u *companyUsecaseImpl) GetByKey(ctx context.Context, key uint) (*models.Company, *apierrors.CustomError) {
	company, err := u.companyRepository.GetByKey(key)
	if err != nil {
		return nil, &apierrors.CompanyNotFound
	}
	return company, nil
}

func (u *companyUsecaseImpl) GetAllInfo(ctx context.Context) (*[]models.CompanyInfo, error) {
	companies, err := u.companyRepository.GetAllCompaniesInfo()
	if err != nil {
		return nil, err
	}
	return companies, nil
}
