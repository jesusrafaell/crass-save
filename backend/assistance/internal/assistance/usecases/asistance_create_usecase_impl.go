package usecases

import (
	"context"
	"fmt"
	"log"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	coinModel "bitbucket.org/mya/mya-assistance-core/internal/coin/models"
	"bitbucket.org/mya/mya-assistance-core/pkg/status"
	"bitbucket.org/mya/mya-assistance-core/types"
	"bitbucket.org/mya/mya-assistance-core/utils"
)

func (u *assistanceUsecaseImpl) Create(ctx context.Context, assitance *models.CreateAssistance) (*models.AssistanceResponse, *apierrors.CustomError) {
	if assitance.WsUserID == nil {
		existAssist, errExist := u.repository.ValidStatusRequest(&assitance.UserId, nil)
		if errExist != nil {
			return nil, &apierrors.ErrorServer
		}
		if existAssist != nil {
			return nil, apierrors.NewCustomErrMsg(&apierrors.AssistRequestAlready,
				fmt.Sprintf("reqId: %s", existAssist.ID))
		}
	}

	lang := utils.GetLang(ctx)

	status, err := u.statusRepo.GetByKey(lang, status.ActiveKey)
	if err != nil {
		return nil, &apierrors.StatusNotFound
	}

	// valid VehicleID
	vehicle, err := u.vehicleRepo.GetByID(assitance.User.VehicleId)
	if err != nil {
		return nil, &apierrors.VehicleNotFound
	}

	//calcualte distance originToDestination
	origin := &types.Location{Lat: assitance.From.Latitude, Lng: assitance.From.Longitude}
	destination := &types.Location{Lat: assitance.To.Latitude, Lng: assitance.To.Longitude}
	userToDestinationMeters, errapi := u.googleMaps.GetDistancePoints(origin, destination)
	if errapi != nil {
		return nil, errapi
	}

	priceXdistance, errgo := u.priceRateRepo.GetPriceXKm(lang, vehicle.TypeID, userToDestinationMeters/1000)
	if errgo != nil {
		log.Printf("Error in CalculateDistanceAndPrice - GetPriceXKm: %v", errgo)
		return nil, apierrors.NewCustomErrMsg(&apierrors.ErrorServer, errgo.Error())
	}

	fmt.Println("DistanceXPrice:", priceXdistance.Km*1000, "meters, ", priceXdistance.Km, "km, ", priceXdistance.PriceKm, priceXdistance.Coin.Symbol)

	newAssistance := entities.Assistance{
		Description:         assitance.Description,
		UserId:              assitance.UserId,
		VehicleId:           assitance.User.VehicleId,
		FromLat:             assitance.From.Latitude,
		FromLng:             assitance.From.Longitude,
		FromAddress:         assitance.From.Address,
		ImagePath1:          assitance.User.Images[0],
		ToLat:               assitance.To.Latitude,
		ToLong:              assitance.To.Longitude,
		ToAddress:           assitance.To.Address,
		ToDescription:       assitance.To.Description,
		StatusId:            status.ID,
		FromToMeters:        userToDestinationMeters,
		TotalDistanceMeters: userToDestinationMeters, //incompleted
		Price:               priceXdistance.PriceKm,
		CoinId:              &priceXdistance.Coin.ID,
		Active:              false,
		Confirmed:           false,
		WSUserID:            assitance.WsUserID,
		// InsuranceId:   insurance.ID,
	}

	if len(assitance.User.Images) > 1 {
		newAssistance.ImagePath2 = &assitance.User.Images[1]
	}

	if err := u.repository.Create(&newAssistance); err != nil {
		log.Printf("assistanceRequest.service, Create: %v", err)
		return nil, err
	}

	go u.RequestLive(newAssistance.ID)

	assistanceResponse, errapi := u.GetByIDWithDetails(ctx, newAssistance.ID)
	if errapi != nil {
		return nil, errapi
	}

	return assistanceResponse, nil
}

func (u *assistanceUsecaseImpl) FindOptionsDrivers(lang string, assistance *models.CreateAssistance) (*[]models.OptionsAssistanceResponse, *apierrors.CustomError) {
	//find drivers
	drivers, err := u.userRepo.GetAnyDriversInRadius(assistance.From.Latitude, assistance.From.Longitude, models.MaxRadiusMeters, 0)
	if err != nil {
		return nil, apierrors.NewCustomErrMsg(&apierrors.DriverNotFound, err.Error())
	}

	origin := &types.Location{
		Lat: assistance.From.Latitude,
		Lng: assistance.From.Longitude,
	}

	averageDistanceMeters := u.calculateAverageDriverToUserDistance(origin, drivers)
	// log.Printf("avgKm: %f km", averageDistanceMeters/1000)

	//get vehicleDat
	vehicle, err := u.vehicleRepo.GetByID(assistance.User.VehicleId)
	if err != nil {
		return nil, &apierrors.VehicleNotFound
	}

	//averageDistanceMeters + orign + destination
	//calcualte distance originToDestination
	destination := &types.Location{Lat: assistance.To.Latitude, Lng: assistance.To.Longitude}
	userToDestinationMeters, errapi := u.googleMaps.GetDistancePoints(origin, destination)
	if errapi != nil {
		return nil, errapi
	}

	totalDistanceMeters := userToDestinationMeters + averageDistanceMeters

	// Calculate distance and price if not available
	priceXdistance, errgo := u.priceRateRepo.GetPriceXKm(lang, vehicle.TypeID, totalDistanceMeters)
	if errgo != nil {
		log.Printf("Error FindOptionsDrivers.GetPriceXKm: %v", errgo)
		return nil, apierrors.NewCustomErrMsg(&apierrors.ErrorServer, errgo.Error())
	}

	fmt.Printf("VehicleType: %s\nTotalMeters: %f meters\nTotalKM: %f km\nPrice: %f %s\nOriginToDestination: %f km\nAvgDriversToUser: %f km\n", vehicle.TypeID, totalDistanceMeters, totalDistanceMeters/1000, priceXdistance.PriceKm, priceXdistance.Coin.Symbol, userToDestinationMeters/1000, averageDistanceMeters/1000)

	coin := &coinModel.Coin{
		ID:     priceXdistance.Coin.ID,
		Key:    priceXdistance.Coin.Key,
		Name:   priceXdistance.Coin.Name,
		Symbol: priceXdistance.Coin.Symbol,
	}

	option := &models.OptionsAssistanceResponse{
		TotalKm:             totalDistanceMeters / 1000,
		Price:               priceXdistance.PriceKm,
		Coin:                coin,
		UserToDestinationKm: userToDestinationMeters / 1000,
		DriverToUserKm:      averageDistanceMeters / 1000,
	}

	options := []models.OptionsAssistanceResponse{*option}

	// add other elements
	incrementKm := option.TotalKm / 2
	incrementPrice := option.Price / 2

	for i := 1; i < 5; i++ {
		newTotalKm := option.TotalKm + (incrementKm * float64(i))
		newOption := models.OptionsAssistanceResponse{
			TotalKm:             newTotalKm,
			Price:               option.Price + (incrementPrice * float64(i)),
			Coin:                coin,
			UserToDestinationKm: userToDestinationMeters / 1000,
			DriverToUserKm:      incrementKm * float64(i),
		}
		options = append(options, newOption)
	}

	return &options, nil
}
