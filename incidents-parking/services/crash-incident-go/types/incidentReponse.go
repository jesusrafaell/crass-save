package types

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type IncidentResponseData struct { //when create response this
	ID             primitive.ObjectID `json:"id,omitempty"`
	Latitude       float64            `json:"latitude"`
	Longitude      float64            `json:"longitude"`
	Status         int32              `json:"status"` //check
	StatusName     string             `json:"statusName"`
	Description    string             `json:"description"`
	UserID         string             `json:"userId"`
	IncidentTypeId string             `json:"incidentTypeId"`
	CreatedTime    int64              `json:"createdTime"`
	UpdatedTime    int64              `json:"updatedTime"`
	Icon           int32              `json:"icon"`
}

type IncidentMobileResponse struct {
	ID              primitive.ObjectID `json:"id,omitempty"`
	Latitude        float64            `json:"latitude"`
	Longitude       float64            `json:"longitude"`
	Status          int32              `json:"status"`
	UserID          string             `json:"userId"`
	TransportTypeID string             `json:"transportId"` //check
	CreatedTime     int64              `json:"createdTime"`
	UpdatedTime     int64              `json:"updatedTime"`
}

type GetNearIncidentResponse struct {
	Incidents        []IncidentResponse       `json:"incidents"`
	MyIncidents      []IncidentResponse       `json:"myIncidents"`
	IncidentsMobiles []IncidentMobileResponse `json:"incidentsMobiles"`
	MyIncidentMobile *IncidentMobileResponse  `json:"myIncidentMobile"`
	Ok               bool                     `json:"ok"`
}

type IncidentsStaticsResponse struct {
	Incidents []IncidentResponse `json:"incidents"`
	Ok        bool               `json:"ok"`
}

// create used dad
type CreatedIncidentResponse struct {
	IncidentResponse
	Ok bool `json:"ok"`
}

type IncidentMobileRes struct {
	IncidentMobileResponse
	Ok bool `json:"ok"`
}

type IncidentResponse struct { //when create response this
	ID             primitive.ObjectID `json:"id,omitempty"`
	Latitude       float64            `json:"latitude"`
	Longitude      float64            `json:"longitude"`
	Status         int32              `json:"status"`
	Description    string             `json:"description"`
	IncidentTypeId string             `json:"incidentTypeId"`
	CreateUserId   string             `json:"createUserId"`
	Distance       float64            `json:"distance"`
	VerifyUser     bool               `json:"verifyUser"`
	CreatedTime    int64              `json:"createdTime"`
	UpdatedTime    int64              `json:"updatedTime"`
	Icon           int32              `json:"icon"`
}

type AllIncidentsResponse struct {
	Statics []IncidentResponseData   `json:"statics"`
	Mobiles []IncidentMobileResponse `json:"mobiles"`
	Ok      bool                     `json:"ok"`
}
