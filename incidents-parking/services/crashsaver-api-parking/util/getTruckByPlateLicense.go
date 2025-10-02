package util

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/google/uuid"
)

type Truck struct {
	UserID       uuid.UUID `json:"userId"`
	LicensePlate string    `json:"licensePlate"`
}

type ApiResponseTruck struct {
	Ok      bool   `json:"ok"`
	Message string `json:"message"`
	Data    Truck  `json:"data"`
}

func GetTruckByLicensePlate(licensePlate string) (*Truck, error) {
	urlUser := os.Getenv("API_USER")
	url := fmt.Sprintf("%s/users/truck?licensePlate=%s", urlUser, licensePlate)

	// fmt.Printf("GetTruck: %s\n", url)

	// create request HTTP
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	//headers
	req.Header.Set("x-user-id", "000")
	req.Header.Set("x-role", "service")

	// create client, send
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// log.Println("resp", resp)

	// Deserializar
	var apiResponse ApiResponseTruck
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, err
	}

	userIdUUID, err := uuid.Parse(apiResponse.Data.UserID.String())
	if err != nil {
		return nil, err
	}
	apiResponse.Data.UserID = userIdUUID

	if !apiResponse.Ok {
		return nil, fmt.Errorf("API error: %s", apiResponse.Message)
	}

	return &apiResponse.Data, nil
}
