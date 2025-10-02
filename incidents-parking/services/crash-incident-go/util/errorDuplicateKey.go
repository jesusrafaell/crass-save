package util

import (
	"errors"

	"go.mongodb.org/mongo-driver/mongo"
)

// isErrorDuplicateKey verifica si el error es un error de clave duplicada.
func IsErrorDuplicateKey(err error) bool {
	var writeErr mongo.WriteException
	if errors.As(err, &writeErr) {
		for _, e := range writeErr.WriteErrors {
			if e.Code == 11000 {
				return true
			}
		}
	}
	return false
}
