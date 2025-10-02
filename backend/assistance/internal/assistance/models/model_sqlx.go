package models

// type AssistanceDB struct {
// 	model.Keys
// 	Description string `db:"description" json:"description"`

// 	// Location from
// 	FromLat     float64 `db:"from_latitude" json:"fromLat"`
// 	FromLong    float64 `db:"from_longitude" json:"fromLong"`
// 	FromAddress string  `db:"from_address" json:"fromAddress"`

// 	// Location to
// 	ToLat         float64 `db:"to_latitude" json:"toLat"`
// 	ToLong        float64 `db:"to_longitude" json:"toLong"`
// 	ToAddress     string  `db:"to_address" json:"toAddress"`
// 	ToDescription string  `db:"to_description" json:"toDescription"`

// 	UserId    uuid.UUID          `db:"user_id" json:"userId"`
// 	User      *model.User        `json:"user,omitempty"`
// 	VehicleId uuid.UUID          `db:"vehicle_id" json:"vehicleId"`
// 	Vehicle   *vModel.VehicleObj `db:"vehicle" json:"vehicle"`

// 	// Tow truck
// 	DriverId   *uuid.UUID          `db:"driver_id" json:"driverId,omitempty"`
// 	Driver     *model.User         `db:"driver" json:"driver,omitempty"`
// 	TowTruckId *uuid.UUID          `db:"tow_truck_id" json:"towTruckId,omitempty"`
// 	TowTruck   *towtrucks.TowTruck `json:"towTruck,omitempty"`
// 	DriverLat  *float64            `db:"driver_latitude" json:"driverLat,omitempty"`
// 	DriverLon  *float64            `db:"driver_longitude" json:"driverLon,omitempty"`

// 	// Distances
// 	FromTo        float64  `db:"dis_from_to" json:"fromTo"`
// 	DriverToUser  *float64 `db:"dis_driver_user" json:"driverToUser,omitempty"`
// 	TotalDistance float64  `db:"total_distance" json:"totalDistance"`

// 	// Times
// 	AcceptedTime           int64 `db:"accepted_time" json:"acceptedTime"`
// 	ToUserTime             int64 `db:"to_user_time" json:"toUserTime"`
// 	ArrivedUserTime        int64 `db:"arrived_user_time" json:"arrivedUserTime"`
// 	ToDestinationTime      int64 `db:"to_destination_time" json:"toDestinationTime"`
// 	ArrivedDestinationTime int64 `db:"arrived_destination_time" json:"arrivedDestinationTime"`
// 	DriverCompletedTime    int64 `db:"driver_completed_time" json:"driverCompletedTime"`
// 	FinishTime             int64 `db:"finish_time" json:"finishTime"`

// 	// Active create user
// 	ImagePath1 string  `db:"image_path_1" json:"imagePath1"`
// 	ImagePath2 *string `db:"image_path_2" json:"imagePath2,omitempty"`

// 	// Accepted driver
// 	AcceptedDriverLat *float64 `db:"accepted_driver_latitude" json:"acceptedDriverLat,omitempty"`
// 	AcceptedDriverLon *float64 `db:"accepted_driver_longitude" json:"acceptedDriverLon,omitempty"`

// 	// To_user driver
// 	ToUserDriverLat *float64 `db:"touser_driver_latitude" json:"toUserDriverLat,omitempty"`
// 	ToUserDriverLon *float64 `db:"touser_driver_longitude" json:"toUserDriverLon,omitempty"`

// 	// Arrived_to_user driver
// 	ArrivedUserDriverLat *float64 `db:"arriveduser_driver_latitude" json:"arrivedUserDriverLat,omitempty"`
// 	ArrivedUserDriverLon *float64 `db:"arriveduser_driver_longitude" json:"arrivedUserDriverLon,omitempty"`

// 	// To_destination driver
// 	ImagePath3             *string  `db:"image_path_3" json:"imagePath3,omitempty"`
// 	ImagePath4             *string  `db:"image_path_4" json:"imagePath4,omitempty"`
// 	ToDestinationDriverLat *float64 `db:"to_destination_driver_latitude" json:"toDestinationDriverLat,omitempty"`
// 	ToDestinationDriverLon *float64 `db:"to_destination_driver_longitude" json:"toDestinationDriverLon,omitempty"`

// 	// Arrived_to_destination driver
// 	ArrivedDesUserDriverLat *float64 `db:"arrived_des_driver_latitude" json:"arrivedDesUserDriverLat,omitempty"`
// 	ArrivedDesUserDriverLon *float64 `db:"arrived_des_driver_longitude" json:"arrivedDesUserDriverLon,omitempty"`

// 	// General
// 	StatusId uuid.UUID      `db:"status_id" json:"statusId"`
// 	Status   *status.Status `db:"status" json:"status"`

// 	Active    bool        `db:"active" json:"active"`
// 	Price     float64     `db:"price" json:"price"`
// 	CoinId    *uuid.UUID  `db:"coin_id" json:"coinId"`
// 	Coin      *coins.Coin `db:"coin" json:"coin,omitempty"`
// 	Confirmed bool        `db:"confirmed" json:"confirmed"`
// 	WS        bool        `db:"ws" json:"ws"`

// 	InsuranceId *uuid.UUID            `db:"insurance_id" json:"insuranceId,omitempty"`
// 	Insurance   *insurances.Insurance `db:"insurance" json:"insurance,omitempty"`

// 	// Driver completed driver
// 	DriverPickCar      *bool    `db:"driver_pick_car" json:"driverPickCar,omitempty"`
// 	DriverObservations *string  `db:"driver_observations" json:"driverObservations,omitempty"`
// 	DriverDamage       *string  `db:"driver_damage" json:"driverDamage,omitempty"`
// 	TotalTime          *int64   `db:"total_time" json:"totalTime,omitempty"`
// 	DriverDistance     *float64 `db:"driver_distance" json:"driverDistance,omitempty"`
// 	ImagePath5         *string  `db:"image_path_5" json:"imagePath5,omitempty"`
// 	ImagePath6         *string  `db:"image_path_6" json:"imagePath6,omitempty"`

// 	// User completed user
// 	UserObservations *string  `db:"user_observations" json:"userObservations,omitempty"`
// 	UserPickCar      *bool    `db:"user_pick_car" json:"userPickCar,omitempty"`
// 	UserDamage       *string  `db:"user_damage" json:"userDamage,omitempty"`
// 	UserDistance     *float64 `db:"user_distance" json:"userDistance,omitempty"`
// 	Stars            *uint32  `db:"stars" json:"stars,omitempty"`

// 	// New
// 	CompanyId *uuid.UUID         `db:"company_id" json:"companyId,omitempty"`
// 	Company   *companies.Company `db:"company" json:"company,omitempty"`
// }

// type AssistanceResponse struct {
// 	// ---- base
// 	ID          uuid.UUID `db:"id" json:"id"`
// 	CreatedAt   int64     `json:"createdAt,omitempty" db:"created_at"`
// 	Description string    `db:"description" json:"description"`
// 	//info
// 	Active bool    `db:"active" json:"active"`
// 	Price  float64 `db:"price" json:"price"`
// 	Stars  *uint32 `db:"stars" json:"stars,omitempty"`

// 	//distances
// 	FromTo        float64  `db:"dis_from_to" json:"fromTo"`
// 	DriverToUser  *float64 `db:"dis_driver_user" json:"driverToUser,omitempty"`
// 	TotalDistance float64  `db:"total_distance" json:"totalDistance"`

// 	//times
// 	AcceptedTime           int64 `db:"accepted_time" json:"acceptedTime"`
// 	ToUserTime             int64 `db:"to_user_time" json:"toUserTime"`
// 	ArrivedUserTime        int64 `db:"arrived_user_time" json:"arrivedUserTime"`
// 	ToDestinationTime      int64 `db:"to_destination_time" json:"toDestinationTime"`
// 	ArrivedDestinationTime int64 `db:"arrived_destination_time" json:"arrivedDestinationTime"`
// 	DriverCompletedTime    int64 `db:"driver_completed_time" json:"driverCompletedTime"`
// 	FinishTime             int64 `db:"finish_time" json:"finishTime"`

// 	// from
// 	// FromLat     float64 `db:"from_latitude" json:"fromLat"`
// 	// FromLong    float64 `db:"from_longitude" json:"fromLong"`
// 	// FromAddress string  `db:"from_address" json:"fromAddress"`
// 	From types.OriginAssitence `json:"from" db:"from"`

// 	// to
// 	// ToLat         float64 `db:"to_latitude" json:"toLat"`
// 	// ToLong        float64 `db:"to_longitude" json:"toLong"`
// 	// ToAddress     string  `db:"to_address" json:"toAddress"`
// 	// ToDescription string  `db:"to_description" json:"toDescription"`

// 	To types.DestinationAssistance `json:"to" db:"to"`

// 	Accepted *types.Coordinates `db:"accepted" json:"accepted,omitempty"`

// 	// TimeElapsed types.TimeElapsed  `json:"timeElapsed"`

// 	Status *types.Status `db:"status" json:"status,omitempty"`

// 	// ----end-base

// 	// Company     *types.BaseKey              `json:"company,omitempty"`
// 	// Coin        *types.CoinResponse         `json:"coin,omitempty"`

// 	// User    *types.User         `json:"user,omitempty"`
// 	// Vehicle *vehicle.VehicleObj `json:"vehicle,omitempty"`

// 	// Driver   *model.User           `json:"driver,omitempty"`
// 	// TowTruck *towTruck.TowTruckObj `json:"towTruck,omitempty"`

// }
