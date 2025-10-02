package usecases

import (
	"context"
	"database/sql"
	"errors"
	"log"
	"regexp"
	"strings"
	"time"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/repositories"
	"bitbucket.org/mya/mya-assistance-core/utils"

	insuranceRepository "bitbucket.org/mya/mya-assistance-core/internal/insurance/repositories"

	"github.com/google/uuid"
)

type VehicleUsecase interface {
	Create(ctx context.Context, req *models.AddVehicle) (*entities.Vehicle, *apierrors.CustomError)
	Update(ctx context.Context, req *models.UpdateVehicle) *apierrors.CustomError
	GetByID(ctx context.Context, id uuid.UUID) (*entities.Vehicle, *apierrors.CustomError)
	Delete(ctx context.Context, vehicleID string) error
	GetVehicles(ctx context.Context) (*[]models.Vehicle, error)
	GetByUserId(ctx context.Context) (*[]models.Vehicle, error)
}

type vehicleUsecaseImpl struct {
	vehicleRepository   repositories.VehicleRepository
	makeRepository      repositories.MakeRepository
	modelRepository     repositories.ModelRepository
	insuranceRepository insuranceRepository.InsuranceRepository
}

func NewVehicleUsecaseImpl(
	vehicleRepository repositories.VehicleRepository,
	makeRepository repositories.MakeRepository,
	modelRepository repositories.ModelRepository,
	insuranceRepository insuranceRepository.InsuranceRepository,
) VehicleUsecase {
	return &vehicleUsecaseImpl{
		vehicleRepository:   vehicleRepository,
		makeRepository:      makeRepository,
		modelRepository:     modelRepository,
		insuranceRepository: insuranceRepository,
	}
}

// functions
func (s *vehicleUsecaseImpl) GetByID(ctx context.Context, id uuid.UUID) (*entities.Vehicle, *apierrors.CustomError) {
	vehicle, err := s.vehicleRepository.GetByID(id)
	if err != nil {
		log.Printf("Error VehicleRepository.Get: %v", err)
		return nil, apierrors.NewCustomErrMsg(&apierrors.VehicleNotFound, err.Error())
	}

	return vehicle, nil
}

func (s *vehicleUsecaseImpl) GetVehicles(ctx context.Context) (*[]models.Vehicle, error) {
	lang := utils.GetLang(ctx)
	return s.vehicleRepository.GetAll(lang)
}

func (s *vehicleUsecaseImpl) GetByUserId(ctx context.Context) (*[]models.Vehicle, error) {

	dataContext, err := utils.GetDataContext(ctx)
	if err != nil {
		return nil, err
	}

	vehicles, err := s.vehicleRepository.GetByUserId(dataContext.Lang, dataContext.UserID)
	if err != nil {
		return nil, err
	}
	return vehicles, nil
}

func (s *vehicleUsecaseImpl) Create(ctx context.Context, req *models.AddVehicle) (*entities.Vehicle, *apierrors.CustomError) {

	errapi := s.validateRequest(req)
	if errapi != nil {
		return nil, errapi
	}

	make, err := s.makeRepository.GetByModelID(req.ModelID)
	if err != nil {
		log.Printf("Error VehicleService.GetMakeByModelID %v", err)
		return nil, &apierrors.MakeNotFound
	}

	if req.InsuranceID == nil {
		insurance, err := s.insuranceRepository.GetByKey(1)
		if err != nil {
			return nil, &apierrors.InsuranceNotFound
		}
		req.InsuranceID = &insurance.ID
	}

	// Convert VehicleRequest to Vehicle
	vehicle := entities.Vehicle{
		UserID:           req.UserID,
		Year:             req.Year,
		LicensePlate:     req.LicensePlate,
		PolicyNumber:     req.PolicyNumber,
		ImagePath:        req.ImagePath,
		MakeID:           make.ID,
		ModelID:          req.ModelID,
		TypeID:           req.TypeID,
		WeightID:         req.WeightID,
		EngineTypeID:     req.EngineTypeID,
		ColorID:          req.ColorID,
		InsuranceID:      *req.InsuranceID,
		DriveTrainTypeID: req.DriveTrainTypeID,
		CountryID:        req.CountryID,
		Active:           false,
	}

	if err := s.vehicleRepository.Create(&vehicle); err != nil {
		return nil, err
	}

	return &vehicle, nil
}

func (s *vehicleUsecaseImpl) Update(ctx context.Context, req *models.UpdateVehicle) *apierrors.CustomError {
	//valid vehicle
	vehicle, err := s.vehicleRepository.GetByID(req.ID)
	if err != nil {
		return &apierrors.VehicleNotFound
	}

	//valid Year
	if req.Year != nil {
		if *req.Year < 1700 || *req.Year > uint(time.Now().Year()+1) {
			return &apierrors.InvalidYear
		}
		vehicle.Year = *req.Year
	}

	//Valid LicensePlate
	if req.LicensePlate != nil && len(*req.LicensePlate) > 0 {
		if matchLicensePlate, _ := regexp.MatchString("^[a-zA-Z0-9]{6,}$", *req.LicensePlate); !matchLicensePlate {
			return &apierrors.InvalidLicensePlate
		}
		if *req.LicensePlate != vehicle.LicensePlate {
			v, err := s.ExistLicensePlate(*req.LicensePlate)
			if err != nil {
				return &apierrors.ErrorServer
			}
			if v != nil && v.ID != vehicle.ID {
				return &apierrors.ExistLicensePlate
			}
		}
		vehicle.LicensePlate = *req.LicensePlate
	}

	if req.ImagePath != nil {
		vehicle.ImagePath = *req.ImagePath
	}

	if req.ModelID != nil {
		vehicle.MakeID = *req.ModelID
	}

	if req.TypeID != nil {
		vehicle.TypeID = *req.TypeID
	}
	if req.EngineTypeID != nil {
		vehicle.EngineTypeID = *req.EngineTypeID
	}
	if req.InsuranceID != nil {
		vehicle.InsuranceID = *req.InsuranceID
	}
	if req.WeightID != nil {
		vehicle.WeightID = *req.WeightID
	}
	if req.ColorID != nil {
		vehicle.ColorID = *req.ColorID
	}
	if req.DriveTrainTypeID != nil {
		vehicle.DriveTrainTypeID = *req.DriveTrainTypeID
	}

	if req.Active != nil {
		vehicle.Active = *req.Active
	}

	//valid insurance & policyNumber
	if req.InsuranceID != nil || req.PolicyNumber != nil {
		if req.PolicyNumber != nil && *req.PolicyNumber != "" {
			if matchPolicyNumber, _ := regexp.MatchString("^[a-zA-Z0-9]+$", *req.PolicyNumber); !matchPolicyNumber || len(*req.PolicyNumber) < 3 {
				return &apierrors.InvalidPolicyNumber
			}
			vehicle.PolicyNumber = req.PolicyNumber
		}
		//valid match Insurance & PolicyNumber
		errc := s.existInsuranceAndPolicyNumber(vehicle.InsuranceID, *vehicle.PolicyNumber)
		if errc != nil {
			return errc
		}
	}

	//Update vehicle
	if err := s.vehicleRepository.Update(vehicle); err != nil {
		return &apierrors.ErrorServer
	}
	// Si Active es true, desactivar otros towTrucks
	if req.Active != nil && *req.Active {
		if err := s.vehicleRepository.DeactivateVehicles(vehicle.ID); err != nil {
			log.Printf("Error desactivando otros vehicle: %v", err)
			return &apierrors.ErrorServer
		}
	}

	return nil
}

func (s *vehicleUsecaseImpl) Delete(ctx context.Context, vehicleID string) error {
	id, err := uuid.Parse(vehicleID)
	if err != nil {
		return err
	}
	return s.vehicleRepository.Delete(id)
}

func (s *vehicleUsecaseImpl) ExistLicensePlate(LicensePlate string) (*entities.Vehicle, error) {
	vehicle, err := s.vehicleRepository.GetByLicensePlate(LicensePlate)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}
	return vehicle, nil
}

func (s *vehicleUsecaseImpl) existInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) *apierrors.CustomError {
	vehicle, err := s.vehicleRepository.GetByInsuranceAndPolicyNumber(insuranceID, policyNumber)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return apierrors.NewCustomErrMsg(&apierrors.ErrorServer, err.Error())
	}
	if vehicle != nil {
		return &apierrors.ExistPolicyNumber
	}
	return nil
}

func (s *vehicleUsecaseImpl) validateRequest(req *models.AddVehicle) *apierrors.CustomError {
	// Channle erros
	errorsChan := make(chan *apierrors.CustomError, 2)

	currentYear := time.Now().Year()
	if req.Year < 1700 || req.Year > uint(currentYear+1) {
		return &apierrors.InvalidYear
	}

	// Goroutine regexp
	go func() {
		req.LicensePlate = strings.TrimSpace(req.LicensePlate)
		if !regexp.MustCompile("^[a-zA-Z0-9-]{6,}$").MatchString(req.LicensePlate) {
			errorsChan <- &apierrors.InvalidLicensePlate
			return
		}

		v, err := s.ExistLicensePlate(req.LicensePlate)
		if err != nil {
			errorsChan <- &apierrors.ErrorServer
			return
		}
		if v != nil {
			errorsChan <- &apierrors.ExistLicensePlate
			return
		}

		errorsChan <- nil
	}()

	// Goroutine db
	go func() {
		if req.PolicyNumber != nil && *req.PolicyNumber != "" {
			policyNumber := strings.TrimSpace(*req.PolicyNumber)
			req.PolicyNumber = &policyNumber
			if !regexp.MustCompile("^[a-zA-Z0-9]+$").MatchString(policyNumber) || len(policyNumber) < 3 {
				errorsChan <- &apierrors.InvalidPolicyNumber
				return
			}
			if err := s.existInsuranceAndPolicyNumber(*req.InsuranceID, policyNumber); err != nil {
				errorsChan <- &apierrors.ExistPolicyNumber
				return
			}
		}
		errorsChan <- nil
	}()

	for i := 0; i < 2; i++ {
		err := <-errorsChan
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *vehicleUsecaseImpl) GetByLicensePlate(licensePlate string) (*entities.Vehicle, error) {
	vehicle, err := s.vehicleRepository.GetByLicensePlate(licensePlate)
	if err != nil {
		return nil, err
	}
	return vehicle, nil
}
