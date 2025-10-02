package services

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"api/driveassist/types"
	"api/driveassist/util"
	codeError "api/driveassist/util/errorcodes"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AssistanceRequestService struct {
	repo             repository.AssistanceRequest
	repoStatus       repository.StatusRepository
	vehicleService   VehicleService
	insuranceService InsurancesService
}

func NewAssistanceReqService(db *gorm.DB) *AssistanceRequestService {
	return &AssistanceRequestService{
		repo:             *repository.NewAssistanceReqRepository(db),
		repoStatus:       *repository.NewStatusRepository(db),
		insuranceService: *NewInsurancesService(db),
		vehicleService:   *NewVehicleService(db),
	}
}

func (s *AssistanceRequestService) Create(req types.AssistanceRequest) *codeError.CustomError {
	//get Data
	//valid pre exist
	status, _ := s.repoStatus.GetByNameEN("active")

	assist, _ := s.repo.GetByUserAndStatus(req.UserID, status.ID)
	if assist != nil {
		return codeError.NewCustomError("assistRequestAlready")
	}

	// log.Println(req.UserID, status.ID)
	// log.Println(assist)

	vehicle, err := s.vehicleService.GetByID(req.User.VehicleID)
	if err != nil {
		return codeError.NewCustomError("vehicleNotFound")
	}
	insurance, _ := s.insuranceService.GetById(vehicle.InsuranceID)

	distance1 := util.Haversine(req.User.Latitude, req.User.Longitude, req.Destination.Latitude, req.Destination.Longitude)

	// log.Println("Distance: ", distance1)

	// Convert VehicleRequest to Vehicle
	newRequest := model.AssistanceRequest{
		UserID:         req.UserID,
		VehicleID:      req.User.VehicleID,
		UserLat:        req.User.Latitude,
		UserLong:       req.User.Longitude,
		ImagePath1:     req.User.Images[0],
		ImagePath2:     req.User.Images[1],
		Latitude:       req.Destination.Latitude,
		Longitude:      req.Destination.Longitude,
		Address:        req.Destination.Address,
		Description:    req.Destination.Description,
		StatusID:       status.ID,
		DistanceToUser: 0,
		DistanceToDes:  distance1,
		Price:          100,
		Active:         true,
		InsuranceID:    insurance.ID,
	}

	if err := s.repo.Create(&newRequest); err != nil {
		return err
	}
	return nil
}

func (s *AssistanceRequestService) GetAll() (*[]model.AssistanceRequest, error) {
	assitances, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}
	return assitances, nil
}

func (s *AssistanceRequestService) GetByUserID(userID uuid.UUID) (*model.AssistanceRequest, *codeError.CustomError) {
	assistance, err := s.repo.GetByUserID(userID)

	if err != nil {
		return nil, codeError.NewCustomError("assistanceNotExist")
	}

	return assistance, nil
}

func (s *AssistanceRequestService) Cancel(req types.AssistanceCancel) error {
	status, _ := s.repoStatus.GetByNameEN("cancelled")

	assist, err := s.repo.GetByID(req.Id)
	if err != nil {
		return codeError.NewCustomError("assistRequestAlready")
	}

	assist.StatusID = status.ID

	if err := s.repo.Update(assist); err != nil {
		return err
	}

	return nil
}

func (s *AssistanceRequestService) Update(idStr string, req types.AssistanceUpdate) error {
	id, err := uuid.Parse(idStr)
	if err != nil {
		return err
	}

	//valid vehicle
	assist, err := s.repo.GetByID(id)
	if err != nil {
		return codeError.NewCustomError("assistanceNotFound")
	}

	if req.StatusID != uuid.Nil {
		assist.StatusID = req.StatusID
	}

	if err := s.repo.Update(assist); err != nil {
		return err
	}

	return nil
}
