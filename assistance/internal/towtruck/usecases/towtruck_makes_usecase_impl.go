package usecases

import (
	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/repositories"

	"github.com/google/uuid"
)

type TowTruckMakesUsecase interface {
	GetAll() (*[]models.TowTruckMake, error)
	Create(data *models.TowTruckMake) *apierrors.CustomError
	Update(id uuid.UUID, make *models.TowTruckMake) *apierrors.CustomError
}

type towTruckMakesUsecaseImpl struct {
	towTruckMakesRepository repositories.TowTruckMakesRepository
}

func NewTowTruckMakesUsecaseImpl(towTruckMakesRepository repositories.TowTruckMakesRepository) TowTruckMakesUsecase {
	return &towTruckMakesUsecaseImpl{
		towTruckMakesRepository: towTruckMakesRepository,
	}
}

func (u *towTruckMakesUsecaseImpl) GetAll() (*[]models.TowTruckMake, error) {
	return u.towTruckMakesRepository.GetAll()
}

func (u *towTruckMakesUsecaseImpl) Create(data *models.TowTruckMake) *apierrors.CustomError {
	//valid not exist
	make, _ := u.towTruckMakesRepository.GetByName(data.Name)
	if make != nil {
		return &apierrors.Duplicate
	}

	if err := u.towTruckMakesRepository.Create(&entities.TowTruckMake{
		Name: data.Name,
	}); err != nil {
		// log.Printf("Error maketowtruckservice.create %v", err)
		return apierrors.NewCustomErrMsg(&apierrors.ErrorServer, err.Error())
	}
	return nil
}

func (u *towTruckMakesUsecaseImpl) Update(id uuid.UUID, make *models.TowTruckMake) *apierrors.CustomError {
	if err := u.towTruckMakesRepository.Update(&entities.TowTruckMake{
		ID:   id,
		Name: make.Name,
	}); err != nil {
		// fmt.Println("Error towtruck_makes_usecase.Update", err)
		return apierrors.NewCustomErrMsg(&apierrors.MakeNotFound, err.Error())
	}
	return nil
}
