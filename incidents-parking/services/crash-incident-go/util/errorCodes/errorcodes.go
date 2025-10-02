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
	"error":                  {Code: "R0000", Name: "internal error"},
	"incidentExist":          {Code: "R023E", Name: "There is already an incident in 100 meters"},
	"incidentNotFound":       {Code: "R024E", Name: "Incident not found"},
	"statusIncidentInvalid":  {Code: "R026E", Name: `The status field must be "active", "in_progress", or "resolved"`},
	"verifyIncidentNotFound": {Code: "R032E", Name: "verifyIncident not found"},
	"verifyIncidentExist":    {Code: "R033E", Name: "verifyIncident alrady exist"},
	"outOfRange":             {Code: "R002LE", Name: "Latitude or Longitude is out of range"},
	"incidentMobileActive":   {Code: "R002IE", Name: "User have incident mobile active"},
}

func NewCustomError(errorName string) *CustomError {
	if errorCode, exists := ListCodeErrors[errorName]; exists {
		return &errorCode
	}
	return &CustomError{Code: "Error", Name: "error"}
}

// func NewCustomError(errorName string, err error) *types.ErrorResponse {
// 	if errorCode, exists := ListCodeErrors[errorName]; exists {
// 		return &types.ErrorResponse{
// 			Error: errorCode.Code,
// 			Name:  errorCode.Desc,
// 			Ok:    false,
// 		}
// 	}
// 	return &types.ErrorResponse{
// 		Error: "Error",
// 		Name:  err.Error(),
// 		Ok:    false,
// 	}
// }
