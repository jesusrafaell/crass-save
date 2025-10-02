package usecases

import (
	"context"
	"log"
	"regexp"
	"time"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
)

func (s *towTruckUsecaseImpl) Update(ctx context.Context, req *models.UpdateTowTruck) *apierrors.CustomError {
	towTruck, err := s.towTruckRepository.GetByID(req.ID)
	if err != nil {
		return &apierrors.TowtruckNotFound
	}

	if req.Year != nil {
		if *req.Year < 1700 || *req.Year > uint(time.Now().Year()+1) {
			return &apierrors.InvalidYear
		}
		towTruck.Year = *req.Year
	}

	if req.LicensePlate != nil {
		if matchLicensePlate, _ := regexp.MatchString("^[a-zA-Z0-9]{6,}$", *req.LicensePlate); !matchLicensePlate {
			return &apierrors.InvalidLicensePlate
		}
		if *req.LicensePlate != towTruck.LicensePlate {
			tt, err := s.existLicensePlate(*req.LicensePlate)
			if err != nil {
				return apierrors.NewCustomErrMsg(&apierrors.ErrorServer, "existLicensePlate")
			}
			if tt != nil {
				return &apierrors.ExistLicensePlate
			}
		}
		towTruck.LicensePlate = *req.LicensePlate
	}

	if req.ImagePath != nil {
		towTruck.ImagePath = *req.ImagePath
	}

	if req.MakeID != nil {
		towTruck.MakeID = *req.MakeID
	}
	if req.TypeId != nil {
		towTruck.TypeID = *req.TypeId
	}
	if req.EngineTypeID != nil {
		towTruck.EngineTypeID = *req.EngineTypeID
	}
	if req.InsuranceID != nil {
		towTruck.InsuranceID = *req.InsuranceID
	}
	if req.WeightID != nil {
		towTruck.WeightID = *req.WeightID
	}
	if req.ColorID != nil {
		towTruck.ColorID = *req.ColorID
	}
	if req.DriveTrainTypeID != nil {
		towTruck.DriveTrainTypeID = *req.DriveTrainTypeID
	}

	if req.Active != nil {
		towTruck.Active = *req.Active
	}
	if req.DriverId != nil {
		towTruck.DriverID = req.DriverId
	}
	if req.RemoveDriver != nil && *req.RemoveDriver {
		towTruck.DriverID = nil
	}

	if req.InsuranceID != nil || req.PolicyNumber != nil {
		if req.PolicyNumber != nil && *req.PolicyNumber != "" {
			if matchPolicyNumber, _ := regexp.MatchString("^[a-zA-Z0-9]+$", *req.PolicyNumber); !matchPolicyNumber || len(*req.PolicyNumber) < 3 {
				return &apierrors.InvalidPolicyNumber
			}
			towTruck.PolicyNumber = req.PolicyNumber
		}
		errc := s.existInsuranceAndPolicyNumber(towTruck.InsuranceID, *towTruck.PolicyNumber)
		if errc != nil {
			return errc
		}
	}

	if errc := s.towTruckRepository.Update(towTruck); errc != nil {
		log.Printf("Error towtruckservice.Update: %v", *errc.Message)
		return errc
	}

	if req.Active != nil && *req.Active && towTruck.DriverID != nil {
		if err := s.towTruckRepository.DeactivateTowTrucks(towTruck.ID, *towTruck.DriverID); err != nil {
			log.Printf("Error desactivando otros towtrucks: %v", err)
			return &apierrors.ErrorServer
		}
	}

	return nil
}
