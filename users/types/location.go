package types

type Location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type LocationNearby struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Radius    uint64  `json:"radius"`
}
