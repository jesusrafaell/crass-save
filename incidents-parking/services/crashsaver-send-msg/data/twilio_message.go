package model

type MessageWS struct {
	To   string `json:"to,omitempty"`
	Body string `json:"body,omitempty"`
}
