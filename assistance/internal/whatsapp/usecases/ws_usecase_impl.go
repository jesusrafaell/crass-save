package usecases

import (
	"context"
	"strings"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/utils"

	countryRepository "bitbucket.org/mya/mya-assistance-core/internal/country/repositories"

	assistanceModels "bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	assistanceUsecases "bitbucket.org/mya/mya-assistance-core/internal/assistance/usecases"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/models"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/repositories"

	vehicleRepository "bitbucket.org/mya/mya-assistance-core/internal/vehicle/repositories"
	weightRepository "bitbucket.org/mya/mya-assistance-core/internal/weight/repositories"

	"bitbucket.org/mya/mya-assistance-core/pkg/users"

	"fmt"

	"bitbucket.org/mya/mya-assistance-core/types"

	"github.com/google/uuid"
)

type wsUsecaseImpl struct {
	//repos
	repository *repositories.WsRepository
	//services
	assistanceUsecase assistanceUsecases.AssistanceUsecase
	vehicleRepo       vehicleRepository.VehicleRepository
	vehicleTypeRepo   vehicleRepository.TypeRepository
	vehicleMakeRepo   vehicleRepository.MakeRepository
	vehicleModelRepo  vehicleRepository.ModelRepository
	weightRepo        weightRepository.WeightRepository
	countryRepo       countryRepository.CountryRepository
	userRepo          users.UserRepository
}

func NewWSUsecaseImpl(
	repository *repositories.WsRepository,
	assistanceUsecase assistanceUsecases.AssistanceUsecase,
	vehicleRepo vehicleRepository.VehicleRepository,
	vehicleTypeRepo vehicleRepository.TypeRepository,
	vehicleMakeRepo vehicleRepository.MakeRepository,
	vehicleModelRepo vehicleRepository.ModelRepository,
	weightRepo weightRepository.WeightRepository,
	countryRepo countryRepository.CountryRepository,
	userRepo users.UserRepository,
) WSUsecase {
	return &wsUsecaseImpl{
		repository:        repository,
		assistanceUsecase: assistanceUsecase,
		vehicleRepo:       vehicleRepo,
		vehicleTypeRepo:   vehicleTypeRepo,
		vehicleMakeRepo:   vehicleMakeRepo,
		vehicleModelRepo:  vehicleModelRepo,
		weightRepo:        weightRepo,
		countryRepo:       countryRepo,
		userRepo:          userRepo,
	}
}

func (u *wsUsecaseImpl) GetVehicleTypes(ctx context.Context) (string, error) {
	lang := utils.GetLang(ctx)
	types, err := u.vehicleTypeRepo.GetAllByWS(lang)
	if err != nil || types == nil {
		return "", err
	}

	var str string

	for _, t := range *types {
		str += fmt.Sprintf("%d) %s\n", t.Key, t.Name)
	}

	return str, nil
}

func (u *wsUsecaseImpl) GetVehicleMakeModel(ctx context.Context, req *models.WSVehicleMakeAndModel) (*models.VehicleMakeAndModelReponse, error) {
	makeAndModel, err := u.vehicleMakeRepo.GetVehicleMakeAndModelByNames(&req.MakeName, &req.ModelName)
	if err != nil {
		return nil, &apierrors.MakeNotFound
	}
	makeModelResponse := &models.VehicleMakeAndModelReponse{
		MakeID:    makeAndModel.Make.ID,
		MakeName:  makeAndModel.Make.Name,
		ModelID:   makeAndModel.Model.ID,
		ModelName: makeAndModel.Model.Name,
	}
	return makeModelResponse, nil
}

func (u *wsUsecaseImpl) GetVehicleModelsByMake(ctx context.Context, makeName string) (*types.NameReponse, error) {
	models, err := u.vehicleModelRepo.GetByMakeName(makeName)
	if err != nil {
		return nil, &apierrors.MakeNotFound
	}

	// Extract names directly
	modelNames := make([]string, len(*models))
	for i, model := range *models {
		modelNames[i] = model.Name
	}

	return &types.NameReponse{
		Name: strings.Join(modelNames, " - "),
	}, nil
}

func (u *wsUsecaseImpl) GetVehicleMakeAndModelByModel(ctx context.Context, modelName string) (*models.VehicleMakeAndModelReponse, error) {
	makeAndModel, err := u.vehicleMakeRepo.GetVehicleMakeAndModelByNames(nil, &modelName)
	if err != nil {
		return nil, &apierrors.ModelNotFound
	}
	makeModelResponse := &models.VehicleMakeAndModelReponse{
		MakeID:    makeAndModel.Make.ID,
		MakeName:  makeAndModel.Make.Name,
		ModelID:   makeAndModel.Model.ID,
		ModelName: makeAndModel.Model.Name,
	}
	return makeModelResponse, nil
}

func (u *wsUsecaseImpl) CancelRequest(ctx context.Context, reqID uuid.UUID, desc string) *apierrors.CustomError {

	// get userid by mobile

	if err := u.assistanceUsecase.Cancel(ctx, &assistanceModels.CancelAssistance{
		// UserID:      req.UserID, //user from ws
		ID:          reqID,
		Description: desc,
		RoleKey:     users.RoleKeyUser,
	}); err != nil {
		return err
	}

	return nil
}

// func (u *wsUsecaseImpl) PostWs(data types.Ws) (*[]types.Ws, error) {
// 	// ws, err := s.repository.Create(data)
// 	// if err != nil {
// 	// 	return nil, err
// 	// }
// 	// return ws, nil
// 	return nil, nil
// }

func (u *wsUsecaseImpl) GetDataUserWs(ctx context.Context, identityDocument string) (*models.WsUserBotize, *apierrors.CustomError) {
	wsUser, err := u.repository.GetWsUserByIdentity(identityDocument)
	if err != nil || wsUser == nil {
		return nil, apierrors.NewCustomErrMsg(&apierrors.ErrorServer, fmt.Sprintf("user not found %v", err))
	}

	fmt.Println(wsUser)

	var identityDocumentPath string
	if wsUser.IdentityDocumentPath != nil {
		identityDocumentPath = *wsUser.IdentityDocumentPath
	}

	return &models.WsUserBotize{
		DocIdent:      wsUser.IdentityDocument,
		DoctIdentPath: identityDocumentPath,
		FullName:      wsUser.FirstName + " " + wsUser.LastName,
		Mobile:        wsUser.Mobile,
		Email:         wsUser.Email,
		CountryKey:    wsUser.CountryKey,
	}, nil
}

func (u *wsUsecaseImpl) GetDataVehicleWs(ctx context.Context, licensePlate string) (*models.WSVehicleBotize, *apierrors.CustomError) {
	vehicle, err := u.vehicleRepo.GetByLicensePlate(licensePlate)
	if err != nil {
		return nil, &apierrors.VehicleNotFound
	}

	return &models.WSVehicleBotize{
		LicensePlate: vehicle.LicensePlate,
		Year:         vehicle.Year,
		ModelID:      vehicle.MakeID,
		TypeKey:      0,
		WeightKey:    0,
	}, nil
}
