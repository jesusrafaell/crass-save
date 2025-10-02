package services

import (
	"crashsaver/fcm/pkg/fcm"
	"crashsaver/fcm/pkg/twilio_otp"
)

type Service struct {
	fcm    *fcm.FcmClient
	twilio *twilio_otp.Twilio
}

func NewService(fcm *fcm.FcmClient, twilio *twilio_otp.Twilio) *Service {
	return &Service{
		fcm,
		twilio,
	}
}
