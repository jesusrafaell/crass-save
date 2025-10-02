package types

type Location struct {
	Lat float64 `json:"latitude" db:"latitude"`
	Lng float64 `json:"longitude" db:"longitude"`
}

func ConvertToLocationResponse(lat, lng *float64) *Location {
	if lat == nil || lng == nil {
		return nil
	}
	return &Location{
		Lat: *lat,
		Lng: *lng,
	}
}

func ConvertLocationToLocationResponse(location *Location) *Location {
	if location == nil {
		return nil
	}
	return &Location{
		Lat: location.Lat,
		Lng: location.Lng,
	}
}
