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
	"invalidRequest":            {Code: "R000V", Name: "invalid request format"},
	"errorServer":               {Code: "R001V", Name: "error in server"},
	"vehicleNotFound":           {Code: "R002V", Name: "vechile not found"},
	"invalidYear":               {Code: "R003V", Name: "must be > 1700 and <= next year"},
	"invalidLicensePlate":       {Code: "R004V", Name: "invalid LicensePlate: must be >= 6 alphanumeric characters"},
	"invalidPolicyNumber":       {Code: "R006V", Name: "invalid policy number: must be alphanumeric and >= 3 characters"},
	"existLicensePlate":         {Code: "R007V", Name: "LicensePlate already exist"},
	"existPolicyNumber":         {Code: "R008V", Name: "Policy Number already exist"},
	"existImagePath":            {Code: "R010V", Name: "Path Image already exist"},
	"brandNotFound":             {Code: "R011V", Name: "brand not found"},
	"modelNotFound":             {Code: "R012V", Name: "model not found"},
	"typeMachineNotFound":       {Code: "R013V", Name: "typeMachine not found"},
	"typeNotFound":              {Code: "R014V", Name: "type not found"},
	"weightNotFound":            {Code: "R015V", Name: "weight not found"},
	"insuranceNotFound":         {Code: "R016V", Name: "insurance not found"},
	"colorNotFound":             {Code: "R017V", Name: "color not found"},
	"towtruckNotFound":          {Code: "R018V", Name: "tow truck not found"},
	"assistRequestFail":         {Code: "R001A", Name: "assistrequest fail"},
	"assistanceNotFound":        {Code: "R002A", Name: "assistrequest not found"},
	"assistanceNotExist":        {Code: "R002A", Name: "user have not request"},
	"assistRequestAlready":      {Code: "R003A", Name: "user have assist request"},
	"assistanceImagesDuplicate": {Code: "R004A", Name: "Images is duplicate"},
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
