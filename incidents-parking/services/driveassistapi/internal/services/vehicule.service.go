package services

import (
	"api/driveassist/data/model"
	repo "api/driveassist/internal/repository"
	"api/driveassist/types"
	codeError "api/driveassist/util/errorcodes"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type VehicleService struct {
	vehicle repo.VehicleRepository
}

func NewVehicleService(db *gorm.DB) *VehicleService {
	return &VehicleService{
		vehicle: *repo.NewVehicleRepository(db),
	}
}

func (s *VehicleService) GetAll() (*[]model.Vehicle, error) {
	return s.vehicle.GetAll()
}

func (s *VehicleService) GetByUserID(userID string) (*[]model.Vehicle, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, err
	}
	vehicles, err := s.vehicle.GetByUserID(userUUID)
	if err != nil {
		return nil, err
	}
	return vehicles, nil
}

func (s *VehicleService) Create(req types.VehicleRequest) *codeError.CustomError {

	err := s.validateRequest(req)
	if err != nil {
		return err
	}

	// Convert VehicleRequest to Vehicle
	newVehicle := model.Vehicle{
		Year:             req.Year,
		Tuition:          req.Tuition,
		PolicyNumber:     req.PolicyNumber,
		ImagePath:        req.ImagePath,
		UserID:           req.UserID,
		BrandID:          req.BrandID,
		ModelID:          req.ModelID,
		TypeID:           req.TypeID,
		WeightID:         req.WeightID,
		TypeMachineID:    req.TypeMachineID,
		ColorID:          req.ColorID,
		InsuranceID:      req.InsuranceID,
		DriveTrainTypeID: req.DriveTrainTypeID,
		CountryID:        req.CountryID,
	}

	if err := s.vehicle.Create(&newVehicle); err != nil {
		return err
	}
	return nil
}

func (s *VehicleService) Update(vehicleID string, req types.VehicleRequest) error {
	id, err := uuid.Parse(vehicleID)
	if err != nil {
		return err
	}

	//valid vehicle
	vehicle, err := s.vehicle.GetByID(id)
	if err != nil {
		return codeError.NewCustomError("vehicleNotFound")
	}

	//valid Year
	if req.Year != 0 {
		if req.Year < 1700 || req.Year > uint(time.Now().Year()+1) {
			return codeError.NewCustomError("invalidYear")
		}
		vehicle.Year = req.Year
	}

	//Valid Tuition
	if req.Tuition != "" {
		if matchTuition, _ := regexp.MatchString("^[a-zA-Z0-9]{6,}$", req.Tuition); !matchTuition {
			return codeError.NewCustomError("invalidLicensePlate")
		}
		if req.Tuition != vehicle.Tuition {
			err := s.existTuition(req.Tuition)
			if err != nil {
				return codeError.NewCustomError("existLicensePlate")
			}
		}
		vehicle.Tuition = req.Tuition
	}

	if req.ImagePath != "" {
		vehicle.ImagePath = req.ImagePath
	}

	// update is exist
	if req.BrandID != uuid.Nil {
		vehicle.BrandID = req.BrandID
	}
	if req.ModelID != uuid.Nil {
		vehicle.ModelID = req.ModelID
	}
	if req.TypeID != uuid.Nil {
		vehicle.TypeID = req.TypeID
	}
	if req.TypeMachineID != uuid.Nil {
		vehicle.TypeMachineID = req.TypeMachineID
	}
	if req.InsuranceID != uuid.Nil {
		vehicle.InsuranceID = req.InsuranceID
	}
	if req.WeightID != uuid.Nil {
		vehicle.WeightID = req.WeightID
	}
	if req.ColorID != uuid.Nil {
		vehicle.ColorID = req.ColorID
	}
	if req.DriveTrainTypeID != uuid.Nil {
		vehicle.DriveTrainTypeID = req.DriveTrainTypeID
	}

	//valid insurance & policyNumber
	if req.InsuranceID != uuid.Nil || req.PolicyNumber != "" {
		// Valid PolicyNumber
		if req.PolicyNumber != "" {
			if matchPolicyNumber, _ := regexp.MatchString("^[a-zA-Z0-9]+$", req.PolicyNumber); !matchPolicyNumber || len(req.PolicyNumber) < 3 {
				return codeError.NewCustomError("invalidPolicyNumber")
			}
			vehicle.PolicyNumber = req.PolicyNumber
		}
		//valid match Insurance & PolicyNumber
		err = s.existInsuranceAndPolicyNumber(vehicle.InsuranceID, vehicle.PolicyNumber)
		if err != nil {
			return codeError.NewCustomError("existPolicyNumber")
		}
	}

	//Update vehicle
	if err := s.vehicle.Update(vehicle); err != nil {
		return err
	}

	return nil
}

func (s *VehicleService) existTuition(tuition string) error {
	existVehicle, err := s.vehicle.GetByTuition(tuition)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if existVehicle != nil {
		return fmt.Errorf("TuitionIsUsed")
	}
	return nil
}

func (s *VehicleService) existInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) error {
	existVehicle, err := s.vehicle.GetByInsuranceAndPolicyNumber(insuranceID, policyNumber)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if existVehicle != nil {
		return fmt.Errorf("PolicyNumberAlreadyExist")
	}
	return nil
}

func (s *VehicleService) Delete(vehicleID string) error {
	id, err := uuid.Parse(vehicleID)
	if err != nil {
		return err
	}
	return s.vehicle.Delete(id)
}

func (s *VehicleService) validateRequest(req types.VehicleRequest) *codeError.CustomError {
	// Channle erros
	errorsChan := make(chan *codeError.CustomError, 2)

	// Goroutine regexp
	go func() {
		currentYear := time.Now().Year()
		if req.Year < 1700 || req.Year > uint(currentYear+1) {
			errorsChan <- codeError.NewCustomError("invalidYear")
			return
		}

		req.Tuition = strings.TrimSpace(req.Tuition)
		if !regexp.MustCompile("^[a-zA-Z0-9]{6,}$").MatchString(req.Tuition) {
			errorsChan <- codeError.NewCustomError("invalidLicensePlate")
			return
		}

		req.PolicyNumber = strings.TrimSpace(req.PolicyNumber)
		if !regexp.MustCompile("^[a-zA-Z0-9]+$").MatchString(req.PolicyNumber) || len(req.PolicyNumber) < 3 {
			errorsChan <- codeError.NewCustomError("invalidPolicyNumber")
			return
		}

		errorsChan <- nil
	}()

	// Goroutine db
	go func() {
		if err := s.existInsuranceAndPolicyNumber(req.InsuranceID, req.PolicyNumber); err != nil {
			errorsChan <- codeError.NewCustomError("existPolicyNumber")
			return
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

func (s *VehicleService) GetByID(userID uuid.UUID) (*model.Vehicle, error) {
	vehicle, err := s.vehicle.GetByID(userID)
	if err != nil {
		return nil, err
	}
	return vehicle, nil
}
