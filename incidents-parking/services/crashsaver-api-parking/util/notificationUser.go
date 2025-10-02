package util

import (
	"bytes"
	"crashsaver/parking/types"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/google/uuid"
)

type ApiResponseNotification struct {
	Ok      bool   `json:"ok"`
	Message string `json:"message"`
}

func NotificationUser(userId uuid.UUID, licensePlate string) (*ApiResponseNotification, error) {
	urlUser := os.Getenv("API_USER")
	url := fmt.Sprintf("%s/notification/user", urlUser)

	fmt.Printf("Notification: %s\n", url)

	requestBody := types.NotificationUserRequest{
		UserId:  userId,
		Title:   "Nueva Reserva de Parking",
		Message: "Se ha creado una nueva reserva a " + licensePlate,
		Sound:   "",
	}

	jsonValue, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonValue))
	if err != nil {
		log.Printf("Error creating request for notification driver: %s", userId)
		return nil, err
	}

	// Agregar encabezados necesarios
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-user-id", "000")
	req.Header.Set("x-role", "service")

	// create HTTP and send
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending notification to driver: %s", userId)
		return nil, err
	}
	defer resp.Body.Close()

	var apiResponse ApiResponseNotification
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, err
	}

	if !apiResponse.Ok {
		return nil, fmt.Errorf("API error: %s", apiResponse.Message)
	}

	log.Printf("UserId: %s, notificated", userId)

	return &apiResponse, nil
}

func SendEmail(data *types.EmailBody) (*ApiResponseNotification, error) {
	urlUser := os.Getenv("API_USER")
	url := fmt.Sprintf("%s/email/send", urlUser)

	fmt.Printf("send email: %s\n", url)

	jsonValue, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonValue))
	if err != nil {
		log.Printf("Error creating request for email send: %v", err)
		return nil, err
	}

	// Agregar encabezados necesarios
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-user-id", "000")
	req.Header.Set("x-role", "service")

	// create HTTP and send
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending email: %V", err)
		return nil, err
	}
	defer resp.Body.Close()

	var apiResponse ApiResponseNotification
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, err
	}

	if !apiResponse.Ok {
		return nil, fmt.Errorf("API error: %s", apiResponse.Message)
	}

	log.Printf("Email sended %s", data.To)

	return &apiResponse, nil
}
