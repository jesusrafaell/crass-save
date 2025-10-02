package services

import (
	"context"
	model "crashsaver/fcm/data"
	"fmt"
	"log"

	api "github.com/twilio/twilio-go/rest/api/v2010"
)

func (f *Service) SendOTPWithWS(ctx context.Context, ws model.MessageWS) error {
	params := &api.CreateMessageParams{}
	params.SetTo("whatsapp:" + ws.To)
	params.SetFrom("whatsapp:" + f.twilio.From)
	params.SetBody(ws.Body)

	log.Println("from: whatsapp:" + f.twilio.From)
	log.Println("to: whatsapp:" + ws.To)
	log.Println("body:" + ws.Body)

	resp, err := f.twilio.Client.Api.CreateMessage(params)
	if err != nil {
		fmt.Println(err.Error())
		return err
	} else {
		if resp.Sid != nil {
			fmt.Println(*resp.Sid)
		} else {
			fmt.Println(resp.Sid)
		}
		fmt.Println("Message sent successfully!")
	}
	return nil
}
