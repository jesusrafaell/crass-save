package models

import (
	companyModel "bitbucket.org/mya/mya-assistance-core/internal/company/models"
	towTruckModel "bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	vehicleModel "bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"
	statusModel "bitbucket.org/mya/mya-assistance-core/pkg/status/models"
	userModel "bitbucket.org/mya/mya-assistance-core/pkg/users/models"

	coinModel "bitbucket.org/mya/mya-assistance-core/internal/coin/models"
	"bitbucket.org/mya/mya-assistance-core/types"

	"github.com/google/uuid"
)

type AssistanceResponse struct {
	ID          uuid.UUID `json:"id"`        //p
	CreatedAt   int64     `json:"createdAt"` //p
	Description string    `json:"description"`

	//distances
	UserToDestination float64  `json:"userToDestination"`
	DriverToUser      *float64 `json:"driverToUser,omitempty"`
	TotalDistance     float64  `json:"totalDistance"`

	//info
	Active bool    `json:"active"`
	Price  float64 `json:"price"` //p
	Stars  *uint32 `json:"stars,omitempty"`

	//times
	AcceptedTime           int64 `json:"acceptedTime"`
	ToUserTime             int64 `json:"toUserTime"`
	ArrivedUserTime        int64 `json:"arrivedUserTime"`
	ToDestinationTime      int64 `json:"toDestinationTime"`
	ArrivedDestinationTime int64 `json:"arrivedDestinationTime"`
	DriverCompletedTime    int64 `json:"driverCompletedTime"`
	FinishTime             int64 `json:"finishTime"`

	Status   *statusModel.Status           `json:"status"` //p
	User     *userModel.User               `json:"user,omitempty"`
	Vehicle  *vehicleModel.VehicleUser     `json:"vehicle"` //p
	Driver   *userModel.User               `json:"driver,omitempty"`
	TowTruck *towTruckModel.TowTruckDriver `json:"towTruck,omitempty"`
	Company  *companyModel.CompanyResponse `json:"company,omitempty"`

	//coordenates
	From OriginAssitence       `json:"from"` //p
	To   DestinationAssistance `json:"to"`   //p

	//extras
	Accepted    *types.Location   `json:"accepted,omitempty"`
	Coin        *coinModel.Coin   `json:"coin,omitempty"` //p
	TimeElapsed types.TimeElapsed `json:"timeElapsed"`
}

type OptionsAssistanceResponse struct {
	TotalKm             float64         `json:"totalKm"`
	Price               float64         `json:"price"`
	Coin                *coinModel.Coin `json:"coin,omitempty"`
	UserToDestinationKm float64         `json:"userToDestinationKm"`
	DriverToUserKm      float64         `json:"driverToUserKm"`
}
