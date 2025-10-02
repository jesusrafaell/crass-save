package customError

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
	"invalidRequest":      {Code: "R000", Name: "invalid request format"},
	"errorServer":         {Code: "R001", Name: "error in server"},
	"insufficientCredits": {Code: "R002P", Name: "insufficient credits"},
	"bookingNotFound":     {Code: "R003P", Name: "booking not found"},
	"parkingNotFound":     {Code: "R004P", Name: "parking not found"},
	"bookingExpired":      {Code: "R010P", Name: "booking expired"},
	"bookingNotCancelled": {Code: "R012P", Name: "booking cant cancell"},
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
