package model

type MessageWS struct {
	To   string `bson:"to,omitempty" json:"to,omitempty"`
	Body string `bson:"body,omitempty" json:"body,omitempty"`
}
