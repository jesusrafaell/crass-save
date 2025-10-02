package twilio_otp

import (
	"os"

	"github.com/twilio/twilio-go"
)

type Twilio struct {
	Client *twilio.RestClient
	From   string
}

func NewTwilio() *Twilio {
	authToken := os.Getenv("AUTH_TOKEN")
	accountSID := os.Getenv("SID")
	from := os.Getenv("TWILIO_NUMBER")
	return &Twilio{
		Client: NewTwilioClient(accountSID, authToken),
		From:   from,
	}
}
