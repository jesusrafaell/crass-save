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

type TowTruckService struct {
	repo repo.TowTruckRepository
}

func NewTowTruckService(db *gorm.DB) *TowTruckService {
	return &TowTruckService{
		repo: *repo.NewTowTruckRepository(db),
	}
}

func (s *TowTruckService) GetAll() (*[]model.TowTruck, error) {
	return s.repo.GetAll()
}

func (s *TowTruckService) GetByUserID(userID string) (*[]model.TowTruck, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, err
	}
	trucks, err := s.repo.GetByUserID(userUUID)
	if err != nil {
		return nil, err
	}
	return trucks, nil
}

func (s *TowTruckService) Create(req types.TowTruckRequest) *codeError.CustomError {

	err := s.validateRequest(req)
	if err != nil {
		return err
	}

	// Convert VehicleRequest to Vehicle
	newTruck := model.TowTruck{
		Year:             req.Year,
		LicensePlate:     req.LicensePlate,
		PolicyNumber:     req.PolicyNumber,
		ImagePath:        req.ImagePath,
		OwnerID:          req.OwnerID,
		OwnerType:        1,
		UserID:           req.UserID,
		MakeID:           req.MakeID,
		CraneTypeID:      req.CraneTypeID,
		WeightID:         req.WeightID,
		TypeMachineID:    req.TypeMachineID,
		ColorID:          req.ColorID,
		InsuranceID:      req.InsuranceID,
		DriveTrainTypeID: req.DriveTrainTypeID,
		CountryID:        req.CountryID,
		MaximumLoad:      req.MaximumLoad,
		Height:           req.Height,
		Length:           req.Length,
	}

	if err := s.repo.Create(&newTruck); err != nil {
		return err
	}
	return nil
}

func (s *TowTruckService) Update(idStr string, req types.TowTruckRequest) error {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return err
	}

	//validtowTruck
	towTruck, err := s.repo.GetByID(id)
	if err != nil {
		return codeError.NewCustomError("towtruckNotFound")
	}

	//valid Year
	if req.Year != 0 {
		if req.Year < 1700 || req.Year > uint(time.Now().Year()+1) {
			return codeError.NewCustomError("invalidYear")
		}
		towTruck.Year = req.Year
	}

	//Valid Tuition
	if req.LicensePlate != "" {
		if matchTuition, _ := regexp.MatchString("^[a-zA-Z0-9]{6,}$", req.LicensePlate); !matchTuition {
			return codeError.NewCustomError("invalidLicensePlate")
		}
		if req.LicensePlate != towTruck.LicensePlate {
			err := s.existLicensePlate(req.LicensePlate)
			if err != nil {
				return codeError.NewCustomError("existLicensePlate")
			}
		}
		towTruck.LicensePlate = req.LicensePlate
	}

	if req.ImagePath != "" {
		towTruck.ImagePath = req.ImagePath
	}

	// update is exist
	if req.MakeID != uuid.Nil {
		towTruck.MakeID = req.MakeID
	}
	if req.CraneTypeID != uuid.Nil {
		towTruck.CraneTypeID = req.CraneTypeID
	}
	if req.TypeMachineID != uuid.Nil {
		towTruck.TypeMachineID = req.TypeMachineID
	}
	if req.InsuranceID != uuid.Nil {
		towTruck.InsuranceID = req.InsuranceID
	}
	if req.WeightID != uuid.Nil {
		towTruck.WeightID = req.WeightID
	}
	if req.ColorID != uuid.Nil {
		towTruck.ColorID = req.ColorID
	}
	if req.DriveTrainTypeID != uuid.Nil {
		towTruck.DriveTrainTypeID = req.DriveTrainTypeID
	}

	//valid insurance & policyNumber
	if req.InsuranceID != uuid.Nil || req.PolicyNumber != "" {
		// Valid PolicyNumber
		if req.PolicyNumber != "" {
			if matchPolicyNumber, _ := regexp.MatchString("^[a-zA-Z0-9]+$", req.PolicyNumber); !matchPolicyNumber || len(req.PolicyNumber) < 3 {
				return codeError.NewCustomError("invalidPolicyNumber")
			}
			towTruck.PolicyNumber = req.PolicyNumber
		}
		//valid match Insurance & PolicyNumber
		err = s.existInsuranceAndPolicyNumber(towTruck.InsuranceID, towTruck.PolicyNumber)
		if err != nil {
			return codeError.NewCustomError("existPolicyNumber")
		}
	}

	//UpdatetowTruck
	if err := s.repo.Update(towTruck); err != nil {
		return err
	}

	return nil
}

func (s *TowTruckService) existLicensePlate(licensePlate string) error {
	existVehicle, err := s.repo.GetByLicensePlate(licensePlate)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if existVehicle != nil {
		return fmt.Errorf("LicensePlateIsUsed")
	}
	return nil
}

func (s *TowTruckService) existInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) error {
	existVehicle, err := s.repo.GetByInsuranceAndPolicyNumber(insuranceID, policyNumber)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if existVehicle != nil {
		return fmt.Errorf("PolicyNumberAlreadyExist")
	}
	return nil
}

func (s *TowTruckService) Delete(vehicleID string) error {
	id, err := uuid.Parse(vehicleID)
	if err != nil {
		return err
	}
	return s.repo.Delete(id)
}

func (s *TowTruckService) validateRequest(req types.TowTruckRequest) *codeError.CustomError {
	// Channle erros
	errorsChan := make(chan *codeError.CustomError, 2)

	// Goroutine regexp
	go func() {
		currentYear := time.Now().Year()
		if req.Year < 1700 || req.Year > uint(currentYear+1) {
			errorsChan <- codeError.NewCustomError("invalidYear")
			return
		}

		req.LicensePlate = strings.TrimSpace(req.LicensePlate)
		if !regexp.MustCompile("^[a-zA-Z0-9]{6,}$").MatchString(req.LicensePlate) {
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
