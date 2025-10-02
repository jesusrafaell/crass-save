package twilio_otp

import (
	"os"
)

func NewTwilio() *TwilioClient {
	accountSid := os.Getenv("SID")
	authToken := os.Getenv("AUTH_TOKEN")
	from := os.Getenv("TWILIO_NUMBER")

	return NewTwilioClient(accountSid, authToken, from)
}