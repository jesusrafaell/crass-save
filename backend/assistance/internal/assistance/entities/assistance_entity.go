package entities

import (
	"time"

	coinEntity "bitbucket.org/mya/mya-assistance-core/internal/coin/entities"
	userModel "bitbucket.org/mya/mya-assistance-core/pkg/users/models"

	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	companyEntity "bitbucket.org/mya/mya-assistance-core/internal/company/entities"
	insuranceEntity "bitbucket.org/mya/mya-assistance-core/internal/insurance/entities"
	towTruckEntity "bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	vehicleEntity "bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
	wsEntity "bitbucket.org/mya/mya-assistance-core/internal/whatsapp/entities"
	statusEntity "bitbucket.org/mya/mya-assistance-core/pkg/status/entities"
	userEntity "bitbucket.org/mya/mya-assistance-core/pkg/users/entities"
	"bitbucket.org/mya/mya-assistance-core/types"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Assistance struct {
	ID          uuid.UUID                  `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt   int64                      `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt   int64                      `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt   *int64                     `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	Description string                     `gorm:"column:description;not null" json:"description"`
	UserId      uuid.UUID                  `gorm:"type:uuid;column:user_id;not null" json:"userId"`
	User        *userEntity.User           `gorm:"foreignKey:UserId" json:"user,omitempty"`
	VehicleId   uuid.UUID                  `gorm:"foreignKey:VehicleID;column:vehicle_id;not null" json:"vehicleId"`
	Vehicle     *vehicleEntity.VehicleGORM `json:"vehicle"`

	// Location from
	FromLat     float64 `gorm:"column:from_latitude;not null" json:"fromLat"`
	FromLng     float64 `gorm:"column:from_longitude;not null" json:"fromLong"`
	FromAddress string  `gorm:"column:from_address;not null" json:"fromAddress"`

	// Location to
	ToLat         float64 `gorm:"column:to_latitude;not null" json:"toLat"`
	ToLong        float64 `gorm:"column:to_longitude;not null" json:"toLong"`
	ToAddress     string  `gorm:"column:to_address;not null" json:"toAddress"`
	ToDescription string  `gorm:"column:to_description" json:"toDescription"`

	// Tow truck
	DriverId   *uuid.UUID                   `gorm:"type:uuid;column:driver_id" json:"driverId,omitempty"`
	Driver     *userEntity.User             `gorm:"foreignKey:DriverId" json:"driver,omitempty"`
	TowTruckId *uuid.UUID                   `gorm:"foreignKey:TowTruckID;column:tow_truck_id" json:"towTruckId,omitempty"`
	TowTruck   *towTruckEntity.TowTruckGORM `json:"towTruck,omitempty"`
	DriverLat  *float64                     `gorm:"column:driver_latitude" json:"driverLat,omitempty"`
	DriverLng  *float64                     `gorm:"column:driver_longitude" json:"driverLon,omitempty"`

	// Distances
	FromToMeters        float64  `gorm:"column:dis_from_to;not null" json:"fromTo"`
	DriverToUserMeters  *float64 `gorm:"column:dis_driver_user" json:"driverToUser,omitempty"`
	TotalDistanceMeters float64  `gorm:"column:total_distance" json:"totalDistance"`

	// Times
	AcceptedTime           int64 `gorm:"column:accepted_time;not null" json:"acceptedTime"`
	ToUserTime             int64 `gorm:"column:to_user_time;not null" json:"toUserTime"`
	ArrivedUserTime        int64 `gorm:"column:arrived_user_time;not null" json:"arrivedUserTime"`
	ToDestinationTime      int64 `gorm:"column:to_destination_time;not null" json:"toDestinationTime"`
	ArrivedDestinationTime int64 `gorm:"column:arrived_destination_time;not null" json:"arrivedDestinationTime"`
	DriverCompletedTime    int64 `gorm:"column:driver_completed_time;not null" json:"driverCompletedTime"`
	FinishTime             int64 `gorm:"column:finish_time;not null" json:"finishTime"`

	// Active create user
	ImagePath1 string  `gorm:"column:image_path_1" json:"imagePath1"`
	ImagePath2 *string `gorm:"column:image_path_2" json:"imagePath2,omitempty"`

	// Accepted driver
	AcceptedDriverLat *float64 `gorm:"column:accepted_driver_latitude" json:"acceptedDriverLat,omitempty"`
	AcceptedDriverLon *float64 `gorm:"column:accepted_driver_longitude" json:"acceptedDriverLon,omitempty"`

	// To_user driver
	ToUserDriverLat *float64 `gorm:"column:touser_driver_latitude" json:"toUserDriverLat,omitempty"`
	ToUserDriverLon *float64 `gorm:"column:touser_driver_longitude" json:"toUserDriverLon,omitempty"`

	// Arrived_to_user driver
	ArrivedUserDriverLat *float64 `gorm:"column:arriveduser_driver_latitude" json:"arrivedUserDriverLat,omitempty"`
	ArrivedUserDriverLon *float64 `gorm:"column:arriveduser_driver_longitude" json:"arrivedUserDriverLon,omitempty"`

	// To_destination driver
	ImagePath3             *string  `gorm:"column:image_path_3" json:"imagePath3,omitempty"`
	ImagePath4             *string  `gorm:"column:image_path_4" json:"imagePath4,omitempty"`
	ToDestinationDriverLat *float64 `gorm:"column:to_destination_driver_latitude" json:"toDestinationDriverLat,omitempty"`
	ToDestinationDriverLon *float64 `gorm:"column:to_destination_driver_longitude" json:"toDestinationDriverLon,omitempty"`

	// Arrived_to_destination driver
	ArrivedDesUserDriverLat *float64 `gorm:"column:arrived_des_driver_latitude" json:"arrivedDesUserDriverLat,omitempty"`
	ArrivedDesUserDriverLon *float64 `gorm:"column:arrived_des_driver_longitude" json:"arrivedDesUserDriverLon,omitempty"`

	// General
	StatusId uuid.UUID            `gorm:"foreignKey:StatusID;column:status_id;not null" json:"statusId"`
	Status   *statusEntity.Status `json:"status"`

	Active    bool             `gorm:"column:active" json:"active"`
	Price     float64          `gorm:"column:price" json:"price"`
	CoinId    *uuid.UUID       `gorm:"type:uuid;column:coin_id;not null" json:"coinId"`
	Coin      *coinEntity.Coin `json:"coin,omitempty"`
	Confirmed bool             `gorm:"column:confirmed" json:"confirmed"`

	InsuranceId *uuid.UUID                 `gorm:"foreignKey:InsuranceID;column:insurance_id" json:"insuranceId,omitempty"`
	Insurance   *insuranceEntity.Insurance `json:"insurance,omitempty"`

	// Driver completed driver
	DriverPickCar      *bool    `gorm:"driver_pick_car" json:"driverPickCar,omitempty"`
	DriverObservations *string  `gorm:"driver_observations" json:"driverObservations,omitempty"`
	DriverDamage       *string  `gorm:"driver_damage" json:"driverDamage,omitempty"`
	TotalTime          *int64   `gorm:"total_time" json:"totalTime,omitempty"`
	DriverDistance     *float64 `gorm:"driver_distance" json:"driverDistance,omitempty"`
	ImagePath5         *string  `gorm:"column:image_path_5" json:"imagePath5,omitempty"`
	ImagePath6         *string  `gorm:"column:image_path_6" json:"imagePath6,omitempty"`

	// User completed user
	UserObservations *string  `gorm:"user_observations" json:"userObservations,omitempty"`
	UserPickCar      *bool    `gorm:"user_pick_car" json:"userPickCar,omitempty"`
	UserDamage       *string  `gorm:"user_damage" json:"userDamage,omitempty"`
	UserDistance     *float64 `gorm:"user_distance" json:"userDistance,omitempty"`
	Stars            *uint32  `gorm:"stars" json:"stars,omitempty"`

	// New
	CompanyId *uuid.UUID             `gorm:"type:uuid;column:company_id" json:"companyId,omitempty"`
	Company   *companyEntity.Company `gorm:"foreignKey:CompanyId" json:"company,omitempty"`

	WSUserID *uuid.UUID       `gorm:"type:uuid;column:ws_user_id" json:"ws_user_id"`
	WSUser   *wsEntity.WsUser `gorm:"foreignKey:WSUserID" json:"wsUser,omitempty"`
}

func (Assistance) TableName() string {
	return "a_assistance_requests"
}

func (m *Assistance) BeforeSave(tx *gorm.DB) (err error) {
	now := time.Now().Unix()
	if m.CreatedAt == 0 {
		m.CreatedAt = now
	}
	m.UpdatedAt = now
	return
}

func ConvertAssistanceReqToResponse(assistance *Assistance, lang string) *models.AssistanceResponse {
	var totalSeconds int64
	if assistance.FinishTime > 0 && assistance.AcceptedTime > 0 {
		totalSeconds = assistance.FinishTime - assistance.AcceptedTime
	} else {
		if assistance.AcceptedTime > 0 {
			totalSeconds = time.Now().Unix() - assistance.AcceptedTime
		} else {
			totalSeconds = time.Now().Unix() - assistance.CreatedAt
		}
	}

	var userData userModel.User
	if assistance.WSUserID != nil && assistance.WSUser != nil {
		userData = *wsEntity.ConvertUserWSToModel(assistance.WSUser)
	} else {
		user := userEntity.ConvertUserToModel(assistance.User)
		if user != nil {
			userData = *user
		}
	}

	return &models.AssistanceResponse{
		ID:          assistance.ID,
		Description: assistance.Description,
		User:        &userData,
		Vehicle:     vehicleEntity.ConvertVehicleToVehicleUser(assistance.Vehicle, lang),
		Driver:      userEntity.ConvertUserToModel(assistance.Driver),
		TowTruck:    towTruckEntity.ConvertTowTruckDriver(assistance.TowTruck, lang),
		Company:     companyEntity.ConvertCompanyToResponse(assistance.Company),
		From: models.OriginAssitence{
			Latitude:  assistance.FromLat,
			Longitude: assistance.FromLng,
			Address:   assistance.FromAddress,
		},
		To: models.DestinationAssistance{
			Latitude:    assistance.ToLat,
			Longitude:   assistance.ToLong,
			Address:     assistance.ToAddress,
			Description: assistance.ToDescription,
		},
		Status:            statusEntity.StatusToModel(assistance.Status, lang),
		Accepted:          types.ConvertToLocationResponse(assistance.AcceptedDriverLat, assistance.AcceptedDriverLon),
		CreatedAt:         assistance.CreatedAt,
		TimeElapsed:       types.ConvertSeconds(totalSeconds),
		UserToDestination: assistance.FromToMeters,
		DriverToUser:      assistance.DriverToUserMeters,
		TotalDistance:     assistance.TotalDistanceMeters,

		Active: assistance.Active,
		Price:  assistance.Price,
		Stars:  assistance.Stars,

		Coin: coinEntity.ConvertToCoinResponse(assistance.Coin),
		//times (dates)
		AcceptedTime:           assistance.AcceptedTime,
		ToUserTime:             assistance.ToUserTime,
		ArrivedUserTime:        assistance.ArrivedUserTime,
		ToDestinationTime:      assistance.ToDestinationTime,
		ArrivedDestinationTime: assistance.ArrivedDestinationTime,
		DriverCompletedTime:    assistance.DriverCompletedTime,
		FinishTime:             assistance.FinishTime,
	}
}

func ConvertSeconds(seconds int64) types.TimeElapsed {
	hours := int(seconds / 3600)
	remainingSeconds := seconds % 3600
	minutes := int(remainingSeconds / 60)
	finalSeconds := int(remainingSeconds % 60)

	return types.TimeElapsed{
		Hours:        hours,
		Minutes:      minutes,
		Seconds:      finalSeconds,
		TotalSeconds: seconds,
	}
}
