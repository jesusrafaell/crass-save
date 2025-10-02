package types

type NotificationUserRequest struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Radius    int     `json:"radius"`
	Title     string  `json:"title"`
	Message   string  `json:"message"`
	Sound     string  `json:"sound"`
	UserId    string  `json:"userId"`
	Channel   string  `json:"channel"`
}
