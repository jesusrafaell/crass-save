package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type IncidentType struct {
	ID   primitive.ObjectID `bson:"_id,omitempty"`
	Key  string             `bson:"key"`
	Name string             `bson:"name"`
}
