package types

type VerifyIncidentRequest struct {
	IncidentID string `json:"incident_id"`
	UserID     string `json:"userId"`
	Option     int    `json:"option"`
}

type VerifyIncidentResponse struct {
	ID          string `json:"id"`
	IncidentID  string `json:"incidentId"`
	UserID      string `json:"userId"`
	Option      int    `json:"option"`
	CreatedTime int64  `json:"createdTime"`
	UpdatedTime int64  `json:"updatedTime"`
	OK          bool   `json:"ok"`
}
