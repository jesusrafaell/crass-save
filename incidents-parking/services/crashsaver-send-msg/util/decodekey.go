package util

import (
	"log"
	"os"
)

func GetDecodedFireBaseKey() ([]byte, error) {

	fireBaseAuthKey := os.Getenv("FIREBASE_AUTH_KEY")

	keyContent, err := os.ReadFile(fireBaseAuthKey)
	if err != nil {
		log.Printf("Error reading file keys: %v", err)
		return nil, err
	}

	return keyContent, nil
}
