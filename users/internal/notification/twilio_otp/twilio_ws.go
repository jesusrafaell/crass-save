package twilio_otp

import (
	"context"
	"fmt"
	"log"

	api "github.com/twilio/twilio-go/rest/api/v2010"
)

type MessageWS struct {
	To   string `json:"to,omitempty"`
	Body string `json:"body,omitempty"`
	Lang string `json:"lang,omitempty"`
}

func (t *Twilio) SendOTPWithWS(ctx context.Context, ws MessageWS) error {
	params := &api.CreateMessageParams{}
	params.SetTo("whatsapp:" + ws.To)
	params.SetFrom("whatsapp:" + t.From)
	bodyText := fmt.Sprintf("Tu código de verificación es *%s*. Por tu seguridad, no lo compartas.", ws.Body)
	if ws.Lang == "en" {
		bodyText = fmt.Sprintf("*%s* is your verification code. For your security, do not share this code.", ws.Body)
	}

	params.SetBody(bodyText)

	log.Printf("from: whatsapp:%s", t.From)
	log.Printf("to: whatsapp:%s", ws.To)
	log.Printf("body: %s", bodyText)

	resp, err := t.Client.Api.CreateMessage(params)
	if err != nil {
		log.Printf("Error sending OTP: %s", err.Error())
		return err
	}

	if resp.Sid != nil {
		log.Printf("Message sent successfully! SID: %s", *resp.Sid)
	} else {
		log.Println("Received nil SID in the response")
	}

	return nil
}
