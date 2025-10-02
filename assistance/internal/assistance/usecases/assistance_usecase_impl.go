package usecases

import (
	"context"
	"fmt"

	insuranceRepository "bitbucket.org/mya/mya-assistance-core/internal/insurance/repositories"

	companyRepository "bitbucket.org/mya/mya-assistance-core/internal/company/repositories"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/data/data"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/preloads"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/repositories"
	ratePricesModel "bitbucket.org/mya/mya-assistance-core/internal/rateprice/models"
	ratepriceRepository "bitbucket.org/mya/mya-assistance-core/internal/rateprice/repositories"
	towTruckRepository "bitbucket.org/mya/mya-assistance-core/internal/towtruck/repositories"
	vehicleRepository "bitbucket.org/mya/mya-assistance-core/internal/vehicle/repositories"

	"bitbucket.org/mya/mya-assistance-core/pkg/googlemaps"
	"bitbucket.org/mya/mya-assistance-core/pkg/status"
	statusRepository "bitbucket.org/mya/mya-assistance-core/pkg/status/repositories"
	"bitbucket.org/mya/mya-assistance-core/pkg/users"
	"bitbucket.org/mya/mya-assistance-core/types"
	"bitbucket.org/mya/mya-assistance-core/utils"

	"log"
	"time"

	"github.com/google/uuid"
)

type assistanceUsecaseImpl struct {
	botizeWebHook string
	repository    repositories.AssistanceRepository
	reqDriverRepo repositories.RequestDriverRepository
	vehicleRepo   vehicleRepository.VehicleRepository
	towTruckRepo  towTruckRepository.TowTruckRepository
	// vehicle   vehicle.VehicleUsecase
	// towTruckUsecase  towTruckUsecase.TowTruckUsecase
	statusRepo    statusRepository.StatusRepository
	userRepo      users.UserRepository
	companyRepo   companyRepository.CompanyRepository
	insuranceRepo insuranceRepository.InsuranceRepository
	priceRateRepo ratepriceRepository.RatePriceRepository
	googleMaps    googlemaps.GoogleMapsService
}

func NewAssistanceUsecaseImpl(
	botizeWebHook string,
	assistanceRepository repositories.AssistanceRepository,
	requestDriverRepository repositories.RequestDriverRepository,
	userRepo users.UserRepository,
	vehicleRepo vehicleRepository.VehicleRepository,
	towTruckRepo towTruckRepository.TowTruckRepository,
	statusRepo statusRepository.StatusRepository,
	companyRepo companyRepository.CompanyRepository,
	insuranceRepo insuranceRepository.InsuranceRepository,
	priceRateRepo ratepriceRepository.RatePriceRepository,
	googleMaps googlemaps.GoogleMapsService,
) AssistanceUsecase {
	return &assistanceUsecaseImpl{
		botizeWebHook: botizeWebHook,
		repository:    assistanceRepository,
		reqDriverRepo: requestDriverRepository,
		vehicleRepo:   vehicleRepo,
		towTruckRepo:  towTruckRepo,
		statusRepo:    statusRepo,
		userRepo:      userRepo,
		companyRepo:   companyRepo,
		insuranceRepo: insuranceRepo,
		priceRateRepo: priceRateRepo,
		googleMaps:    googleMaps,
	}
}

func (s *assistanceUsecaseImpl) GetList(ctx context.Context, params *models.ParamsRequestGet) (*[]models.AssistanceResponse, error) {
	assitances, err := s.repository.GetList(params)
	if err != nil {
		return nil, err
	}

	lang := utils.GetLang(ctx)

	res := []models.AssistanceResponse{}
	for _, t := range *assitances {
		res = append(res, *entities.ConvertAssistanceReqToResponse(&t, lang))
	}

	return &res, nil
}

// func (s *assistanceUsecaseImpl) GetAll(lang string) (*[]models.AssistanceResponse, error) {
// 	assitances, err := s.repository.GetAll()
// 	if err != nil {
// 		return nil, err
// 	}
// 	res := []models.AssistanceResponse{}
// 	for _, t := range *assitances {
// 		res = append(res, *entities.ConvertAssistanceReqToResponse(&t, lang))
// 	}

// 	return &res, nil
// }

func (s *assistanceUsecaseImpl) GetPendingByDriverID(ctx context.Context, driverID uuid.UUID) (*[]models.AssistanceResponse, error) {
	assistances, err := s.repository.GetPendingByDriverID(driverID)
	if err != nil {
		return nil, err
	}

	lang := utils.GetLang(ctx)

	assistancesRes := make([]models.AssistanceResponse, 0, len(*assistances))

	for _, t := range *assistances {
		assistancesRes = append(assistancesRes, *entities.ConvertAssistanceReqToResponse(&t, lang))
	}
	return &assistancesRes, nil
}

func (s *assistanceUsecaseImpl) GeByID(ctx context.Context, ID uuid.UUID) (*entities.Assistance, *apierrors.CustomError) {
	assistance, err := s.repository.GetByID(ID)
	if err != nil {
		return nil, &apierrors.AssistanceNotExist
	}

	return assistance, nil
}

func (s *assistanceUsecaseImpl) GetByIDWithDetails(ctx context.Context, id uuid.UUID) (*models.AssistanceResponse, *apierrors.CustomError) {
	assistance, err := s.repository.GetByID(id, preloads.PreloadWithLocationDetails, preloads.PreloadTowTruckWithDetails, preloads.PreloadVehicleWithDetails)
	if err != nil {
		return nil, &apierrors.AssistanceNotExist
	}

	lang := utils.GetLang(ctx)

	assistancesRes := entities.ConvertAssistanceReqToResponse(assistance, lang)

	return assistancesRes, nil
}

func (s *assistanceUsecaseImpl) GetByUserID(ctx context.Context) (*models.AssistanceResponse, *apierrors.CustomError) {

	userID := utils.GetUserID(ctx)

	assistance, err := s.repository.GetByUserID(userID)
	if err != nil {
		return nil, &apierrors.AssistanceNotExist
	}

	lang := utils.GetLang(ctx)

	res := *entities.ConvertAssistanceReqToResponse(assistance, lang)
	return &res, nil
}

func (s *assistanceUsecaseImpl) GetByDriverID(ctx context.Context) (*models.AssistanceResponse, *apierrors.CustomError) {

	driverID := utils.GetUserID(ctx)

	assistance, err := s.repository.GetByDriverID(driverID)
	if err != nil {
		return nil, &apierrors.AssistanceDriverNotExist
	}

	lang := utils.GetLang(ctx)

	res := *entities.ConvertAssistanceReqToResponse(assistance, lang)
	return &res, nil
}

func (s *assistanceUsecaseImpl) Cancel(ctx context.Context, req *models.CancelAssistance) *apierrors.CustomError {
	status, _ := s.statusRepo.GetByKey(data.EN, status.CancelledKey)

	assist, err := s.repository.GetByID(req.ID)
	if err != nil {
		return &apierrors.AssistRequestAlready
	}

	assist.StatusId = status.ID
	if req.RoleKey == users.RoleKeyDriver {
		assist.DriverObservations = &req.Description
	} else {
		assist.UserObservations = &req.Description
	}

	assist.Active = false
	assist.FinishTime = time.Now().Unix()

	if err := s.repository.Update(assist); err != nil {
		return apierrors.NewCustomErrMsg(&apierrors.ErrorServer, err.Error())
	}

	if err := s.reqDriverRepo.DeleteByReqID(req.ID); err != nil {
		log.Printf("Error Cancel DeleteByReqID: %v", err)
	}

	log.Println("Cancelado ReqId:", req.ID)

	//si canceled by user -> push driver
	if req.UserID == assist.UserId {
		if assist.Driver != nil {
			log.Println("Notification: cancelled by user, push driver", assist.Driver.ID)
			go users.NotificationUser(assist.Driver.ID, data.MessageCancelled)
		}
	} else if assist.Driver != nil && req.UserID == assist.Driver.ID {
		log.Println("Notification: cancelled by driver, push user", assist.UserId)
		if assist.WSUserID != nil {
			go users.NotificationUser(assist.UserId, data.MessageCancelled)
		}

	} else {
		if assist.WSUserID != nil {
			go users.NotificationUser(assist.UserId, data.MessageCancelled)
		}
		if assist.Driver != nil {
			go users.NotificationUser(assist.Driver.ID, data.MessageCancelled)
		}
	}

	return nil
}

func (s *assistanceUsecaseImpl) ConfirmedDriver(ctx context.Context, req *models.ConfirmedAssistance) (*models.AssistanceResponse, *apierrors.CustomError) {
	existAssist, err := s.repository.ValidStatusRequest(nil, &req.DriverId)
	if err != nil {
		return nil, &apierrors.ErrorServer
	}
	if existAssist != nil {
		return nil, apierrors.NewCustomErrMsg(&apierrors.AssistRequestAlready, fmt.Sprintf("reqId: %s", existAssist.ID))
	}
	pendingReq, err := s.reqDriverRepo.GetByDriverIDAndReqID(req.DriverId, req.ID)
	if err != nil {
		log.Printf("Error confirmedDriver.GetByDriverIDAndReqID %v", err)
		return nil, apierrors.NewCustomErrMsg(&apierrors.AssitenceNotAvailable, err.Error())
	}

	status, err := s.statusRepo.GetByKey(data.EN, status.WaitingKey)
	if err != nil {
		log.Printf("Error confirmedDriver.GetStatus: %v", err)
		return nil, &apierrors.StatusNotFound
	}

	// Retrieve assistance data
	assistance, err := s.repository.GetByID(req.ID)
	if err != nil {
		log.Printf("Error confirmedDriver.GetById %v", err)
		return nil, &apierrors.AssistanceNotFound
	}
	if assistance.DriverId != nil || assistance.TowTruck != nil {
		log.Printf("Error confirmedDriver.InUsed")
		return nil, &apierrors.AssistanceIsUsed
	}

	//get companyId
	company, err := s.companyRepo.GetByKey(req.CompanyKey)
	if err != nil {
		log.Printf("Error confirmedDriver.GetCompanyByKey %v", err)
		return nil, &apierrors.CompanyNotFound
	}

	// valid towTruck
	tt, err := s.towTruckRepo.GetByID(req.TowTruckId)
	if err != nil {
		log.Printf("Error confirmedDriver.TowTrckGetById %v", err)
		return nil, &apierrors.TowtruckNotFound
	}

	// Set driver data
	assistance.DriverId, assistance.TowTruckId = &req.DriverId, &tt.ID
	assistance.DriverLat, assistance.DriverLng = &req.Latitude, &req.Longitude

	// Calculate price and distance
	distanceXprice := &models.DistanceDriverAndPrice{}
	if pendingReq.TotalDistance > 0 && pendingReq.Price > 0 {
		// Use existing pending request values
		*distanceXprice = models.DistanceDriverAndPrice{
			PriceKm:              pendingReq.Price,
			CoinID:               pendingReq.CoinID,
			DistanceToUserMeters: pendingReq.DriverToUser,
			TotalMetersDistance:  pendingReq.TotalDistance,
		}
	} else {
		// Calculate distance and price if not available
		distanceXPriceAux, err := s.CalculateDistanceAndPrice(assistance)
		if err != nil {
			return nil, apierrors.NewCustomErrMsg(&apierrors.ErrorServer, err.Error())
		}
		distanceXprice = distanceXPriceAux
	}

	fmt.Printf("AssistenceID: %v , DriverID(%v) , distance driver_to_user(%f Meters) \n", req.ID, req.DriverId, distanceXprice.DistanceToUserMeters)

	// Set by distnaceXprice
	assistance.Price = distanceXprice.PriceKm
	assistance.CoinId = &distanceXprice.CoinID
	assistance.TotalDistanceMeters = distanceXprice.TotalMetersDistance
	assistance.DriverToUserMeters = &distanceXprice.DistanceToUserMeters

	// Update assistance information
	assistance.StatusId = status.ID
	assistance.AcceptedDriverLat = &req.Latitude
	assistance.AcceptedDriverLon = &req.Longitude
	assistance.Confirmed, assistance.Active = true, true
	assistance.CompanyId = &company.ID
	assistance.AcceptedTime = time.Now().Unix()

	if err := s.repository.Update(assistance); err != nil {
		log.Printf("Error confirmedRequest.Update  %v", err)
		return nil, &apierrors.AssistRequestFail
	}

	err = s.reqDriverRepo.DeleteByReqID(req.ID)
	if err != nil {
		log.Printf("Error confirmedDriver.DeleteByReqId: %v", err)
		return nil, apierrors.NewCustomErrMsg(&apierrors.ErrorServer, "delete request_drivers")
	}

	//refresh request
	assistanceResponse, errcustom := s.GetByIDWithDetails(ctx, req.ID)
	if errcustom != nil {
		log.Printf("Error confirmedDriver.GetDataById: %v", err)
		return nil, apierrors.NewCustomErrMsg(&apierrors.AssistanceNotFound, "get request after create")
	}

	if assistanceResponse.Driver != nil && assistanceResponse.Driver.ID != req.DriverId {
		log.Printf("Error confirmedDriver:AssistanceIsUsed")
		return nil, &apierrors.AssistanceIsUsed
	}

	// generate timeline for cancel, waiting to user
	go s.RequestWaiting(assistance.ID)

	if assistance.UserId != uuid.Nil {
		go users.NotificationUser(assistance.UserId, data.MessageAccepted)
	}

	if assistance.WSUserID != nil {
		go s.NotificationWS(ctx, assistance.ID)
	}

	return assistanceResponse, nil
}

func (s *assistanceUsecaseImpl) UpdateByDriver(ctx context.Context, req *models.UpdateStatusByDriver) *apierrors.CustomError {
	assist, err := s.repository.GetByID(req.ID)
	if err != nil {
		return &apierrors.AssistanceNotFound
	}

	newStatus, errStatus := s.statusRepo.GetByKey(data.EN, req.StatusKey)
	if errStatus != nil {
		return &apierrors.StatusNotFound
	}

	assist.StatusId = newStatus.ID

	time := time.Now().Unix()

	var message types.MessageNotif

	//to_user
	if req.StatusKey == status.ToUserKey {
		assist.ToUserDriverLat = &req.Latitude
		assist.ToUserDriverLon = &req.Longitude
		assist.ToUserTime = time
		message = data.MessageToUser
	}

	//"arrived_to_user"
	if req.StatusKey == status.ToUserKey {
		assist.ArrivedUserDriverLat = &req.Latitude
		assist.ArrivedUserDriverLon = &req.Longitude
		assist.ArrivedUserTime = time
		message = data.MessageArrivedUser
	}

	//"to_destination"
	if req.StatusKey == status.ToDestinationKey {
		if req.Images == nil {
			return &apierrors.InvalidFormatImg
		}
		if len(req.Images.Paths) < 2 {
			return &apierrors.InvalidFormatImg
		}
		assist.ImagePath3 = &req.Images.Paths[0]
		assist.ImagePath4 = &req.Images.Paths[1]
		assist.ToDestinationDriverLat = &req.Latitude
		assist.ToDestinationDriverLon = &req.Longitude
		assist.ToDestinationTime = time
		// log.Println("Notification: to_destiantion", assist.UserId)
		message = data.MessageToDestination
	}

	// "arrived_to_destination"
	if req.StatusKey == status.ArrivedToDestinationKey {
		assist.ArrivedDesUserDriverLat = &req.Latitude
		assist.ArrivedDesUserDriverLon = &req.Longitude
		assist.ArrivedDestinationTime = time
		// log.Println("Notification: arrived_to_destination", assist.UserId)
		message = data.MessageArrivedDestination
	}

	assist.DriverLat = &req.Latitude
	assist.DriverLng = &req.Longitude

	if err := s.repository.Update(assist); err != nil {
		log.Printf("Error ChangeStatus, Update: %v", err)
		return &apierrors.ErrorServer
	}

	if assist.WSUserID != nil {
		go users.NotificationUser(assist.UserId, message)
	}
	//notification push to user assist.UserId
	return nil
}

func (u *assistanceUsecaseImpl) DriverCompleted(ctx context.Context, req *models.CompletedStatus) *apierrors.CustomError {
	assistance, err := u.repository.GetByID(req.ID)
	if err != nil {
		return &apierrors.AssistRequestAlready
	}

	statusCompleted := status.DriverCompletedKey

	if assistance.WSUserID != nil {
		statusCompleted = status.CompletedKey
	}
	status, errStatus := u.statusRepo.GetByKey(data.EN, statusCompleted)
	if errStatus != nil {
		return &apierrors.StatusNotFound
	}

	assistance.StatusId = status.ID
	assistance.DriverObservations = &req.Observations
	assistance.DriverPickCar = &req.PickCar
	assistance.DriverDamage = &req.Damage
	assistance.DriverDistance = &req.Distance
	assistance.DriverCompletedTime = time.Now().Unix()

	if req.Images == nil {
		return &apierrors.InvalidFormatImg
	}
	if len(req.Images.Paths) < 2 {
		return &apierrors.InvalidFormatImg
	}
	assistance.ImagePath5 = &req.Images.Paths[0]
	assistance.ImagePath6 = &req.Images.Paths[1]
	assistance.Active = false

	log.Println("Notification: driver_completed", assistance.UserId)

	if err := u.repository.Update(assistance); err != nil {
		log.Printf("Error DriverCompleted, Update: %v", err)
		return &apierrors.ErrorServer
	}

	if assistance.WSUserID != nil {
		go users.NotificationUser(assistance.UserId, data.MessageDriverCompleted)
	}

	go u.processCompletedAssistanceForUser(context.Background(), assistance.ID)

	return nil
}

func (u *assistanceUsecaseImpl) UserCompleted(ctx context.Context, req *models.CompletedStatus) *apierrors.CustomError {
	assistance, err := u.repository.GetByID(req.ID)
	if err != nil {
		return &apierrors.AssistRequestAlready
	}

	status, errStatus := u.statusRepo.GetByKey(data.EN, status.CompletedKey)
	if errStatus != nil {
		return &apierrors.StatusNotFound
	}

	assistance.StatusId = status.ID
	assistance.UserObservations = &req.Observations
	assistance.UserPickCar = &req.PickCar
	assistance.UserDamage = &req.Damage
	assistance.UserDistance = &req.Distance
	assistance.Stars = req.Stars
	assistance.Active = false
	assistance.FinishTime = time.Now().Unix()

	if err := u.repository.Update(assistance); err != nil {
		log.Printf("Error UserCompleted, Update: %v", err)
		return &apierrors.ErrorServer
	}

	go u.processCompletedAssistanceForDriver(context.Background(), assistance.ID)

	return nil
}

func (s *assistanceUsecaseImpl) GetByFilter(ctx context.Context, reqId, userId, driverId *uuid.UUID) (*models.AssistanceResponse, *apierrors.CustomError) {
	assitance, err := s.repository.GetByFilter(reqId, userId, driverId)
	if err != nil {
		return nil, &apierrors.AssistanceNotFound
	}

	lang := utils.GetLang(ctx)

	res := entities.ConvertAssistanceReqToResponse(assitance, lang)
	return res, nil
}

func (s *assistanceUsecaseImpl) GetDashboardDataByCompanyId(ctx context.Context, companyId *uuid.UUID) (*models.DashboarData, *apierrors.CustomError) {
	data, err := s.repository.GetDashboardDataByCompany(companyId)
	if err != nil {
		return nil, &apierrors.CompanyNotFound
	}

	return data, nil
}

func (s *assistanceUsecaseImpl) GetAllByCompanyId(ctx context.Context, companyId *uuid.UUID, req *models.FilterDashboardRequest) (*[]models.AssistanceResponse, error) {
	log.Println(companyId)
	assitances, err := s.repository.GetAllByCompanyId(companyId, req)
	if err != nil {
		log.Printf("Error AssistanceService.GetAllByCompanyId %v", err)
		return nil, err
	}

	lang := utils.GetLang(ctx)

	res := []models.AssistanceResponse{}
	for _, t := range *assitances {
		res = append(res, *entities.ConvertAssistanceReqToResponse(&t, lang))
	}

	return &res, nil
}

func (s *assistanceUsecaseImpl) CalPriceAssistance(data *models.CalPriceKm) (*ratePricesModel.Price, error) {
	//distancia driver to user
	distance := s.GetDistancePoints(data.Origin, data.Destination)

	log.Println("Distancia:", distance)

	totalMetersDistance := distance
	if data.AccMeters != nil {
		totalMetersDistance += *data.AccMeters
	}

	priceDistance, err := s.priceRateRepo.GetPriceXKm("es", data.TypeVehicle, totalMetersDistance/1000)
	if err != nil {
		log.Printf("Error CalPriceAssistance.GetPriceKm: %v", err)
		return nil, err
	}

	return priceDistance, nil
}

func (s *assistanceUsecaseImpl) GetDistancePoints(origin, destination types.Location) float64 {
	fmt.Printf("origin:      [%f, %f]\ndestination: [%f,%f]\n", origin.Lat, origin.Lng, destination.Lat, destination.Lng)
	dis, err := s.googleMaps.GetDistancePoints(&origin, &destination)
	if err != nil {
		// log.Printf("Error AssistanceSerivce.GetDistancePoints: %v", err)
		distance := utils.Haversine(origin, destination)
		return distance
	}
	return dis
}

// func (s *assistanceUsecaseImpl) GetAllV2(lang stringmodelsAssistanceResponse, error) {
// 	return s.repository.GetAllV2(lang)
// }

func (u *assistanceUsecaseImpl) processCompletedAssistanceForUser(ctx context.Context, reqID uuid.UUID) error {
	assistance, err := u.repository.GetByID(reqID, preloads.PreloadWithDetails)
	if err != nil {
		return err
	}

	if assistance.WSUserID != nil {
		return fmt.Errorf("is ws")
	}

	fromAddress, err := u.getAddressName(ctx, assistance.FromLat, assistance.FromLng)
	if err != nil {
		fromAddress = ""
	}

	toAddress, err := u.getAddressName(ctx, assistance.ToLat, assistance.ToLong)
	if err != nil {
		toAddress = ""
	}

	totalSeconds := u.calculateTotalTime(assistance)
	totalTime := types.ConvertSeconds(totalSeconds)

	fullName := assistance.User.FirstName + " " + assistance.User.LastName
	emailTemplate := types.TemplateCompletedToUser(types.TemplateData{
		ID:                assistance.ID,
		FullName:          fullName,
		Price:             assistance.Price,
		Symbol:            assistance.Coin.Symbol,
		Status:            "Entregado en Destino",
		FromAddress:       fromAddress,
		ToAddress:         toAddress,
		DistanceKmService: assistance.FromToMeters / 1000, //km
		DistanciaKmTotal:  assistance.TotalDistanceMeters / 1000,
		TotalTime:         totalTime.FormatHHMM(),
		Date:              utils.ConvertUnixToLocalString(assistance.DriverCompletedTime, "America/Bogota"),
	})

	users.SendMailUser(assistance.UserId, users.MessageMail{
		Title: "Resumen del Servicio - Mya",
		Body:  emailTemplate,
	})

	return nil
}

func (u *assistanceUsecaseImpl) processCompletedAssistanceForDriver(ctx context.Context, reqID uuid.UUID) error {
	assistance, err := u.repository.GetByID(reqID, preloads.PreloadWithDetails)
	if err != nil {
		return err
	}

	fromAddress, err := u.getAddressName(ctx, assistance.FromLat, assistance.FromLng)
	if err != nil {
		fromAddress = ""
	}

	toAddress, err := u.getAddressName(ctx, assistance.ToLat, assistance.ToLong)
	if err != nil {
		toAddress = ""
	}

	totalSeconds := u.calculateTotalTime(assistance)
	totalTime := types.ConvertSeconds(totalSeconds)

	fullName := assistance.Driver.FirstName + " " + assistance.Driver.LastName
	emailTemplate := types.TemplateCompletedToDriver(types.TemplateData{
		ID:                assistance.ID,
		FullName:          fullName,
		Price:             assistance.Price,
		Symbol:            assistance.Coin.Symbol,
		Status:            "Servicio Completado",
		DistanceKmService: assistance.FromToMeters / 1000, //km
		DistanciaKmTotal:  assistance.TotalDistanceMeters / 1000,
		FromAddress:       fromAddress,
		ToAddress:         toAddress,
		TotalTime:         totalTime.FormatHHMM(),
		Date:              utils.ConvertUnixToLocalString(assistance.DriverCompletedTime, "America/Bogota"),
	})

	users.SendMailUser(*assistance.DriverId, users.MessageMail{
		Title: "Servicio Completado - Mya",
		Body:  emailTemplate,
	})

	return nil
}

func (u *assistanceUsecaseImpl) getAddressName(ctx context.Context, lat, lng float64) (string, error) {
	location := &types.Location{
		Lat: lat,
		Lng: lng,
	}
	address, err := u.googleMaps.GetAddressName(ctx, location)
	if err != nil {
		return "", err
	}
	return address, nil
}

func (u *assistanceUsecaseImpl) calculateTotalTime(assistance *entities.Assistance) int64 {
	var totalSeconds int64
	currentTime := time.Now().Unix()

	switch {
	case assistance.FinishTime > 0 && assistance.AcceptedTime > 0:
		totalSeconds = assistance.FinishTime - assistance.AcceptedTime
	case assistance.AcceptedTime > 0:
		totalSeconds = currentTime - assistance.AcceptedTime
	default:
		totalSeconds = currentTime - assistance.CreatedAt
	}
	return totalSeconds
}

func (u *assistanceUsecaseImpl) NotificationWS(ctx context.Context, reqID uuid.UUID) error {
	assistance, err := u.repository.GetByID(reqID, preloads.PreloadWithDetails)
	if err != nil {
		return err
	}

	utils.SendWebhook(u.botizeWebHook, assistance.WSUser.Mobile, &assistance.ID)

	return nil
}

func (s *assistanceUsecaseImpl) ConfirmedUser(ctx context.Context, req *models.UpdateStatus) *apierrors.CustomError {
	assist, err := s.repository.GetByID(req.ID)
	if err != nil {
		return &apierrors.AssistanceNotFound
	}

	newStatus, errStatus := s.statusRepo.GetByKey(data.EN, req.StatusKey)
	if errStatus != nil {
		return &apierrors.StatusNotFound
	}

	assist.StatusId = newStatus.ID

	if err := s.repository.Update(assist); err != nil {
		log.Printf("Error ConfirmedUser.Update: %v", err)
		return &apierrors.ErrorServer
	}

	if assist.DriverId != nil {
		go users.NotificationUser(*assist.DriverId, data.MessageConfirmed)
	}
	//notification push to user assist.UserId
	return nil
}
