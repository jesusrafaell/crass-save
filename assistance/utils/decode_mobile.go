package utils

import (
	"net/url"
)

func DecodePhoneNumber(encodedNumber string) string {
	decodedNumber, err := url.QueryUnescape(encodedNumber)
	if err != nil {
		return encodedNumber
	}
	return decodedNumber
}
