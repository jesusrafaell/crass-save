package types

type IncidentStaticRequest struct {
	UserID      string  `json:"userId"` //header
	Description string  `json:"description"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	DriveAssist *bool   `json:"driveAssist,omitempty"`
}

type IncidentMobileRequest struct {
	UserID      string  `json:"userId"` //header
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	TransportID string  `json:"transportType"` //check
}

type GetNearIncidentRequest struct {
	UserID    string  `json:"userId"` //header
	Latitude  float64 `json:"userLatitude"`
	Longitude float64 `json:"userLongitude"`
	Radius    int32   `json:"radius"` //check
	MatchUser bool    `json:"match_user"`
}

type UpdateIncidentRequest struct {
	Status int32 `json:"status"`
	Icon   int32 `json:"icon"`
}

type UpdateLocationIncidentRequest struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type ResolvedIncidentHourRequest struct {
	Hours uint32 `json:"hours"`
}
