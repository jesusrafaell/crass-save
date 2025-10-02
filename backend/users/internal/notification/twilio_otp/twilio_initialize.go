package twilio_otp

import (
	"github.com/twilio/twilio-go"
)

func NewTwilioClient(accountSid string, authToken string) *twilio.RestClient {
	twilio := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})
	return twilio
}