package repositories

import (
	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/preloads"

	"github.com/google/uuid"
)

type AssistanceRepository interface {
	// GetAll() (*[]entities.Assistance, error)
	Create(data *entities.Assistance) *apierrors.CustomError
	Update(data *entities.Assistance) error
	Delete(id uuid.UUID) error
	GetByID(id uuid.UUID, options ...preloads.PreloadOption) (*entities.Assistance, error)
	GetByUserID(userId uuid.UUID) (*entities.Assistance, error)
	GetByDriverID(driverId uuid.UUID) (*entities.Assistance, error)
	GetByFilter(reqId, userId, driverId *uuid.UUID) (*entities.Assistance, error)
	GetPendingByDriverID(driverID uuid.UUID) (*[]entities.Assistance, error)
	GetByUserAndStatus(userId uuid.UUID, statusID uuid.UUID) (*entities.Assistance, error)
	ValidStatusRequest(userId, driverId *uuid.UUID) (*entities.Assistance, error)
	GetDashboardDataByCompany(companyId *uuid.UUID) (*models.DashboarData, error)
	GetAllByCompanyId(companyId *uuid.UUID, filter *models.FilterDashboardRequest) (*[]entities.Assistance, error)
	GetList(filter *models.ParamsRequestGet) (*[]entities.Assistance, error)
	GetByWS(mobile string) (*entities.Assistance, error)
}

// GetDataByID(id uuid.UUID) (*entities.Assistance, error)
// GetByID(id uuid.UUID) (*entities.Assistance, error)
