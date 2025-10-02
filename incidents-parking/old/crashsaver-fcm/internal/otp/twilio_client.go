package twilio_otp

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
)

type TwilioClient struct {
	AccountSID string
	AuthToken  string
	From       string
}

func NewTwilioClient(accountSID, authToken, from string) *TwilioClient {
	return &TwilioClient{
		AccountSID: accountSID,
		AuthToken:  authToken,
		From:       from,
	}
}

func (t *TwilioClient) SendOTPWithWS(to, message string) error {
	urlStr := fmt.Sprintf("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", t.AccountSID)

	msgData := url.Values{}
	msgData.Set("To", to)
	msgData.Set("From", t.From)
	msgData.Set("Message", message)
	msgDataReader := *strings.NewReader(msgData.Encode())

	client := &http.Client{}
	req, err := http.NewRequest("POST", urlStr, &msgDataReader)

	if err != nil {
		return err
	}

	req.SetBasicAuth(t.AccountSID, t.AuthToken)
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	res, err := client.Do(req)

	if err != nil {
		return err
	}

	defer res.Body.Close()

	if res.StatusCode >= 200 && res.StatusCode < 300 {
		var data map[string]interface{}
		decoder := json.NewDecoder(res.Body)
		err := decoder.Decode(&data)

		if err != nil {
			return err
		}

		fmt.Println(data["sid"])
		log.Print("------------Sent sms successfully------------")
	} else {
		return fmt.Errorf("failed to send SMS: %s", res.Status)
	}

	return nil
}