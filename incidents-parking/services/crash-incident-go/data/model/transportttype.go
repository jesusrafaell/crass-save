package model

type TransportType struct {
	ID   string `bson:"_id" json:"_id,omitempty"`
	Key  string `bson:"key" json:"key"`
	Name string `bson:"name" josn:"name"`
}
