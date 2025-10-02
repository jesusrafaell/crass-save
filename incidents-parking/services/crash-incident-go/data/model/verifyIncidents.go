package model

import "go.mongodb.org/mongo-driver/bson/primitive"

const (
	Continue = int(1)
	Finish   = int(2)
	Skip     = int(3)
)

type VerifyIncident struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	UserID     string             `bson:"user_id" json:"user_id"`
	IncidentID primitive.ObjectID `bson:"incident_id" json:"incident_id"`
	Option     int                `bson:"option" json:"option"`
	CreateTime int64              `bson:"created_at" json:"created_at"`
	UpdateTime int64              `bson:"updated_at" json:"updated_at"`
}
