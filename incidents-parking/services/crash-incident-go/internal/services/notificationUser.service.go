package services

import (
	"bytes"
	"crashsaver/incident/types"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type NotificationUser struct {
	URL    string
	client *http.Client
}

func NewNotificationUser() *NotificationUser {
	url := os.Getenv("API_USER")
	return &NotificationUser{
		URL: url,
		client: &http.Client{
			Timeout: 20 * time.Second,
		},
	}
}

func (s *NotificationUser) SendNotification(notification types.NotificationUserRequest) error {
	jsonData, err := json.Marshal(notification)
	if err != nil {
		log.Printf("error code format request: %s", err)
		return err
	}

	req, err := http.NewRequest("POST", s.URL+"/notification/user-radius", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("error create http request: %s", err)
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		log.Printf("error send notification req: %s", err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("request failed with status code %d", resp.StatusCode)
	} else {
		//  body, _ := ioutil.ReadAll(resp.Body)
		log.Printf("Respuesta del servidor: %v", resp.Body)
	}

	return nil
}
