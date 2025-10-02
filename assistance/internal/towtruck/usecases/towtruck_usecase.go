package usecases

import (
	"context"
	"os"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"

	"github.com/google/uuid"
)

type TowTruckUsecase interface {
	Create(ctx context.Context, req *models.CreateTowTruck) *apierrors.CustomError
	GetAll(ctx context.Context) (*[]models.TowTruck, error)
	GetByID(ctx context.Context, towTruckID uuid.UUID) (*entities.TowTruck, error)
	Update(ctx context.Context, req *models.UpdateTowTruck) *apierrors.CustomError
	Delete(ctx context.Context, id uuid.UUID) *apierrors.CustomError
	GetByUserID(ctx context.Context) (*[]models.TowTruck, *apierrors.CustomError)
	GetOneByUserID(ctx context.Context, userID uuid.UUID) (*models.TowTruck, error)
	GetAllByCompanyId(ctx context.Context, companyId uuid.UUID) (*[]models.TowTruck, error)
	RegisterFromFile(ctx context.Context, companyId uuid.UUID, dst *os.File) (*[]models.ErrorListTowTruck, *apierrors.CustomError)
	AddExpenseHistory(ctx context.Context, req *models.AddExpenseTowTruckRequest) *apierrors.CustomError
	GetExpenseHistoryByTTId(ctx context.Context, ttId uuid.UUID, expenseType *uint) ([]entities.TowTruckExpenseHistory, *apierrors.CustomError)
	GetExpenseHistoryByCompanyId(ctx context.Context, companyId uuid.UUID) ([]entities.TowTruckExpenseHistory, *apierrors.CustomError)
	Activate(ctx context.Context, userId uuid.UUID, towTruckId uuid.UUID) *apierrors.CustomError
}
