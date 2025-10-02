package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type IncidentStatic struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Description  string             `bson:"description" json:"description"`
	Location     Point              `bson:"location" json:"location"`
	IncidentType string             `bson:"incident_type_id" json:"incident_type_id"`
	Status       string             `bson:"status" json:"status"`
	UserID       string             `bson:"user_id" json:"user_id"`
	CreateTime   int64              `bson:"created_at" json:"created_at"`
	UpdateTime   int64              `bson:"updated_at" json:"updated_at"`
	Icon         int32              `bson:"icon" json:"icon"`
}

type IncidentMobile struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Location     Point              `bson:"location" json:"location"`
	TransportKey string             `bson:"type_transport_key" json:"type_transport_key"`
	Status       string             `bson:"status" json:"status"`
	UserID       string             `bson:"user_id" json:"user_id"`
	CreateTime   int64              `bson:"created_at" json:"created_at"`
	UpdateTime   int64              `bson:"updated_at" json:"updated_at"`
}

type IncidentMobileWithDistance struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Location    Point              `bson:"location" json:"location"`
	TransportID primitive.ObjectID `bson:"transport_type_id" json:"transport_type_id"`
	Status      string             `bson:"status" json:"status"`
	UserID      string             `bson:"user_id" json:"user_id"`
	CreateTime  int64              `bson:"created_at" json:"created_at"`
	UpdateTime  int64              `bson:"updated_at" json:"updated_at"`
	Distance    float64            `bson:"distance" json:"distance"`
}

type IncidentsRadiusResponse struct {
	Incidents        *[]IncidentStaticNearby
	MyIncidents      *[]IncidentStaticNearby
	IncidentsMobiles *[]IncidentMobile
	MyIncidentMobile *IncidentMobile
}

type IncidentStaticNearby struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Description  string             `bson:"description" json:"description"`
	Location     Point              `bson:"location" json:"location"`
	IncidentType string             `bson:"incident_type_id" json:"incident_type_id"`
	Status       string             `bson:"status" json:"status"`
	UserID       string             `bson:"user_id" json:"user_id"`
	CreateTime   int64              `bson:"created_at" json:"created_at"`
	UpdateTime   int64              `bson:"updated_at" json:"updated_at"`
	Distance     float64            `bson:"distance" json:"distance"`
	VerifyUser   bool               `bson:"verify_user" json:"verify_user"`
	Icon         int32              `bson:"icon" json:"icon"`
}
