package usecases

import (
	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/repositories"
	"log"
)

type TowTruckTypesUsecase interface {
	Create(data *entities.TowTruckType) *apierrors.CustomError
	GetAll(lang string) (*[]models.TowTruckType, error)
	Update(craneType *entities.TowTruckType) *apierrors.CustomError
}

type towTruckTypesUsecaseImpl struct {
	craneTypeRepository repositories.TowTruckTypesRepository
}

func NewTowTruckTypesUsecaseImpl(craneTypeRepository repositories.TowTruckTypesRepository) TowTruckTypesUsecase {
	return &towTruckTypesUsecaseImpl{
		craneTypeRepository: craneTypeRepository,
	}
}

func (u *towTruckTypesUsecaseImpl) Create(data *entities.TowTruckType) *apierrors.CustomError {
	//valid not exist
	crane, _ := u.craneTypeRepository.GetByNames(data.EN, data.ES)
	if crane != nil {
		return &apierrors.Duplicate
	}

	if err := u.craneTypeRepository.Create(data); err != nil {
		log.Printf("Error craneTypeSserivce.create %v", err)
		return &apierrors.ErrorServer
	}
	return nil
}

func (u *towTruckTypesUsecaseImpl) GetAll(lang string) (*[]models.TowTruckType, error) {
	types, err := u.craneTypeRepository.GetAll(lang)
	if err != nil {
		return nil, err
	}
	return types, nil
}

func (u *towTruckTypesUsecaseImpl) Update(towTruckType *entities.TowTruckType) *apierrors.CustomError {
	if err := u.craneTypeRepository.Update(towTruckType); err != nil {
		log.Printf("Error craneTypes.update %v", err)
		return &apierrors.CraneTypeNotFound
	}
	return nil
}
