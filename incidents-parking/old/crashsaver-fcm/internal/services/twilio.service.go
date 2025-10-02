package services

import (
	"context"
	model "crashsaver/fcm/data"
	twilio_otp "crashsaver/fcm/internal/otp"
	"log"
)

type TwilioService interface {
	SendOTPWithWS(context.Context, model.MessageWS) error
}

type twilioService struct {
	twilio twilio_otp.TwilioClient
}

func NewTwilioService(twilio twilio_otp.TwilioClient) *twilioService {
	return &twilioService{
		twilio,
	}
}

func (t *twilioService) SendOTPWithWS(ctx context.Context, ws model.MessageWS) error {
	err := t.twilio.SendOTPWithWS(ws.To, ws.Body)

	if err != nil {
		log.Printf("Error sending WS: %v\n", err)
		return err
	}

	return nil
}