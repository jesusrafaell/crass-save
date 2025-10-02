package codeError

import "fmt"

// CustomError is a struct that holds an error code and message.
type CustomError struct {
	Code string `json:"error"`
	Name string `json:"name"`
}

// Error implements the error interface for CustomError.
func (e CustomError) Error() string {
	return fmt.Sprintf(e.Code)
}

var ListCodeErrors = map[string]CustomError{
	"invalidRequest": {Code: "R000V", Name: "invalid request format"},
}

func NewCustomError(errorName string) *CustomError {
	if errorCode, exists := ListCodeErrors[errorName]; exists {
		return &errorCode
	}
	return &CustomError{Code: "Error", Name: "error"}
}
