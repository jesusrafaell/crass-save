package usecases

import (
	"context"
	"fmt"
	"log"
	"math"
	"strings"
	"time"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/data/data"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/preloads"
	"bitbucket.org/mya/mya-assistance-core/pkg/status"
	"bitbucket.org/mya/mya-assistance-core/pkg/users"
	userModel "bitbucket.org/mya/mya-assistance-core/pkg/users/models"
	"bitbucket.org/mya/mya-assistance-core/types"

	"github.com/google/uuid"
)

func (u *assistanceUsecaseImpl) findDriver(try int, reqID uuid.UUID, maxRadius uint32) (*entities.Assistance, *apierrors.CustomError, bool, bool) {
	assistance, err := u.repository.GetByID(reqID, preloads.PreloadWithDetails, preloads.PreloadVehicleWithDetails)
	if err != nil {
		fmt.Printf("Error calling try: %d, %v", try, err)
		return nil, &apierrors.AssistanceNotFound, false, true
	}

	// Si ya hay un conductor asignado o el estado no es "activo"
	if assistance.Driver != nil || assistance.Status.Key != status.ActiveKey {
		log.Printf("Try: %d | ReqId: %s | StatusKey: %s", try, reqID, assistance.Status.Key)

		err := u.reqDriverRepo.DeleteByReqID(reqID)
		if err != nil {
			log.Printf("Error findDriver.DeleteByReqID: %v", err)
		}
		return assistance, nil, false, false
	}

	log.Printf("Try: %d, Continue find:(%s)", try, reqID)

	if err := u.FindDriverAndAddPending(assistance, maxRadius); err != nil {
		log.Printf("Error finding try: %d and adding pending drivers: %v", try, err.Name)
	}
	return assistance, nil, true, false
}

// search driver nearby(lat, long), (driver_mode = true), filter (capas),
func (u *assistanceUsecaseImpl) RequestLive(reqID uuid.UUID) *apierrors.CustomError {
	// done := make(chan bool)

	ticker := time.NewTicker(time.Duration(models.RefreshTimeRequest))
	defer ticker.Stop()
	stopTimer := time.NewTimer(models.MaxTimeRequest)
	defer stopTimer.Stop()

	try := 1
	// Ejecutar la lógica inmediatamente antes de entrar al bucle
	assistance, err, next, noti := u.findDriver(try, reqID, models.MaxRadiusMeters)
	if err != nil {
		return err
	}
	if !next {
		// Finalizar si next es false desde el inicio
		if noti {
			go users.NotificationUser(assistance.User.ID, data.MessageMaxTimeReached)
		}
		return &apierrors.DriverNotFound
	}

	for {
		select {
		case <-ticker.C:
			try++
			req, err, next, noti := u.findDriver(try, reqID, models.MaxRadiusMeters)
			if err != nil {
				return err
			}
			if !next {
				// Si next es false, detiene la búsqueda
				if noti {
					go users.NotificationUser(req.User.ID, data.MessageMaxTimeReached)
				}
				return &apierrors.DriverNotFound
			}
		case <-stopTimer.C:
			fmt.Println("not find driver, Max time reached, stopping. ")
			go users.NotificationUser(assistance.User.ID, data.MessageMaxTimeReached)
			err := u.reqDriverRepo.DeleteByReqID(reqID)
			if err != nil {
				log.Printf("Error RequestLiv.DeleteByReqID %v", err)
			}
			return &apierrors.DriverNotFound
		}
	}
}

func (u *assistanceUsecaseImpl) FindDriverAndAddPending(assistance *entities.Assistance, maxRadius uint32) *apierrors.CustomError {
	//get drivers
	drivers, err := u.userRepo.GetDriversInRadius(assistance.FromLat, assistance.FromLng, maxRadius, 0)
	if err != nil || len(drivers) == 0 {
		log.Println("Not find driver -> Error:", err)
		return &apierrors.DriverNotFound
	}

	log.Printf("ReqID: %s | Drivers: %d", assistance.ID, len(drivers))

	// agregar a pendiente and notificar grueros
	str := ""
	for _, d := range drivers {
		str += fmt.Sprintf("REQUESTID -> %s | DriverID -> %s | Email: %s  distance: %f km\n", assistance.ID, d.ID, d.Email, d.DistanceMeters/1000)
		now := time.Now().Unix()
		// need calcualte price and distance
		assistance.DriverLat = &d.Location.Lat
		assistance.DriverLng = &d.Location.Lng
		distanceXPrice, errapi := u.CalculateDistanceAndPrice(assistance)
		if errapi != nil {
			log.Printf("Error FindDriverAndAddPending.CalculateDistanceAndPrice %v", err)
			continue
		}
		err := u.reqDriverRepo.Create(&models.RequestDriver{
			DriverID:      d.ID,
			RequestID:     assistance.ID,
			CreatedAt:     now,
			ExpiredAt:     now + int64(models.MaxTimeRequest.Seconds()),
			DriverToUser:  distanceXPrice.DistanceToUserMeters,
			TotalDistance: distanceXPrice.TotalMetersDistance,
			Price:         distanceXPrice.PriceKm,
			CoinID:        distanceXPrice.CoinID,
		})

		if err != nil {
			if !strings.Contains(err.Error(), "idx_driver_request") {
				log.Printf("Error in add driver to a_request_drivers: %v", err)
			}
			continue
		}

		go users.NotificationUser(d.ID, data.MessagePending)
	}
	log.Printf("List:\n %v", str)

	return nil
}

func (u *assistanceUsecaseImpl) CalculateDistanceAndPrice(assistance *entities.Assistance) (*models.DistanceDriverAndPrice, *apierrors.CustomError) {

	driverLocation := &types.Location{
		Lat: *assistance.DriverLat,
		Lng: *assistance.DriverLng,
	}
	userLocation := &types.Location{
		Lat: assistance.FromLat,
		Lng: assistance.FromLng,
	}
	// distanceToUser
	distanceToUserMeters, errapi := u.googleMaps.GetDistancePoints(driverLocation, userLocation)
	if errapi != nil {
		return nil, errapi
	}

	totalDistanceMeters := assistance.FromToMeters + distanceToUserMeters

	// PriceXDistance
	priceXdistance, err := u.priceRateRepo.GetPriceXKm("en", assistance.Vehicle.TypeID, totalDistanceMeters/1000)
	if err != nil {
		log.Printf("Error in CalculateDistanceAndPrice - GetPriceXKm: %v", err)
		return nil, &apierrors.ErrorServer
	}

	fmt.Printf("VehicleType: %s\nTotalMeters: %f meters\nTotalKM: %f km\nPrice: %f %s\nOriginToDestination: %f km\n", assistance.Vehicle.TypeID, totalDistanceMeters, totalDistanceMeters/1000, priceXdistance.PriceKm, priceXdistance.Coin.Symbol, distanceToUserMeters/1000)

	return &models.DistanceDriverAndPrice{
		DistanceToUserMeters: distanceToUserMeters,
		TotalMetersDistance:  totalDistanceMeters,
		CoinID:               priceXdistance.Coin.ID,
		PriceKm:              priceXdistance.PriceKm,
	}, nil
}

func (u *assistanceUsecaseImpl) calculateAverageDriverToUserDistance(userLocation *types.Location, drivers []userModel.Driver) float64 {
	if len(drivers) == 0 {
		return 0
	}

	totalDistance := 0.0

	str := "Drivers:\n"
	for _, driver := range drivers {

		distance, errapi := u.googleMaps.GetDistancePoints(userLocation, &driver.Location)
		if errapi != nil {
			log.Printf("error finddriver_usecase.calculateAverageDriverToUserDistance %v", errapi.Name)
		}
		str += fmt.Sprintf(" %s - %f km\n", driver.Email, distance/1000)
		totalDistance += distance
	}

	log.Println(str)

	averageDistanceMeters := totalDistance / float64(len(drivers))
	return math.Round(averageDistanceMeters*100) / 100
}

func (u *assistanceUsecaseImpl) RequestWaiting(reqID uuid.UUID) *apierrors.CustomError {
	ticker := time.NewTicker(time.Duration(models.RefreshTimeRequestWaiting))
	defer ticker.Stop()
	stopTimer := time.NewTimer(models.MaxTimeRequestWaiting)
	defer stopTimer.Stop()

	assistance, err := u.repository.GetByID(reqID)
	if err != nil {
		return &apierrors.AssistanceNotFound
	}

	try := 0
	for {
		select {
		case <-ticker.C:
			try++
			log.Println("Waiting by user confirmed", try, "| time:", 20*try)
			assistance, err := u.repository.GetByID(reqID, preloads.PreloadWithDetails)
			if err != nil {
				return &apierrors.AssistanceNotFound
			}
			if assistance.Status.Key != status.WaitingKey {
				return nil
			}
		case <-stopTimer.C:
			u.Cancel(context.Background(), &models.CancelAssistance{
				ID:          reqID,
				Description: "cancel timeout user",
				RoleKey:     users.RoleKeyUser,
				UserID:      uuid.Nil,
			})
			go users.NotificationUser(*assistance.DriverId, data.MessageMaxTimeReachedUser)
			err := u.reqDriverRepo.DeleteByReqID(reqID)
			if err != nil {
				log.Printf("Error RequestLiv.DeleteByReqID %v", err)
			}
			return &apierrors.DriverNotFound
		}
	}
}
