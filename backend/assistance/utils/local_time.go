package utils

import (
	"fmt"
	"time"
)

func ConvertUnixToLocalString(unixTime int64, userLocation string) string {
	location, err := time.LoadLocation(userLocation)
	if err != nil {
		fmt.Println("Error loading location:", err)
		return "Error en la fecha"
	}
	localTime := time.Unix(unixTime, 0).In(location)

	// return localTime.Format("2006-01-02 15:04:05")
	return localTime.Format("Monday, Jan 02, 2006 03:04 PM")
}
