package apierrors

import (
	"fmt"
)

// CustomError is a struct that holds an error code and message.
type CustomError struct {
	Code    string  `json:"error"`
	Name    string  `json:"name"`
	Message *string `json:"message,omitempty"`
}

func (e *CustomError) ErrorGo() error {
	if e == nil {
		return nil
	}
	return fmt.Errorf("error: %s - %s", e.Code, e.Name)
}

// Error implements the error interface for CustomError.
func (e CustomError) Error() string {
	return fmt.Sprintf(e.Code)
}

// Define constants for each CustomError
var (
	Ok                     = CustomError{Code: "R11111", Name: "ok"}
	InvalidRequest         = CustomError{Code: "R000V", Name: "invalid request format"}
	ErrorServer            = CustomError{Code: "R001V", Name: "error in server"}
	VehicleNotFound        = CustomError{Code: "R002V", Name: "vehicle not found"}
	InvalidYear            = CustomError{Code: "R003V", Name: "must be > 1700 and <= next year"}
	InvalidLicensePlate    = CustomError{Code: "R004V", Name: "invalid LicensePlate: must be >= 6 alphanumeric characters"}
	InvalidPolicyNumber    = CustomError{Code: "R006V", Name: "invalid policy number: must be alphanumeric and >= 3 characters"}
	ExistLicensePlate      = CustomError{Code: "R007V", Name: "licensePlate already exist"}
	ExistPolicyNumber      = CustomError{Code: "R008V", Name: "policy Number already exist"}
	ExistImagePath         = CustomError{Code: "R010V", Name: "path Image already exist"}
	MakeNotFound           = CustomError{Code: "R011V", Name: "make not found"}
	ModelNotFound          = CustomError{Code: "R012V", Name: "model not found"}
	EngineTypeNotFound     = CustomError{Code: "R013V", Name: "engineType not found"}
	TypeNotFound           = CustomError{Code: "R014V", Name: "type not found"}
	WeightNotFound         = CustomError{Code: "R015V", Name: "weight not found"}
	InsuranceNotFound      = CustomError{Code: "R016V", Name: "insurance not found"}
	ColorNotFound          = CustomError{Code: "R017V", Name: "color not found"}
	TowtruckNotFound       = CustomError{Code: "R018V", Name: "tow truck not found"}
	CraneTypeNotFound      = CustomError{Code: "R019V", Name: "craneType not found"}
	DriveTrainTypeNotFound = CustomError{Code: "R020V", Name: "driveTrainType not found"}
	//
	AssistRequestFail         = CustomError{Code: "R001A", Name: "assistrequest fail"}
	AssistanceNotFound        = CustomError{Code: "R002A", Name: "assistrequest not found"}
	AssistanceNotExist        = CustomError{Code: "R002A", Name: "user not have request"}
	AssistRequestAlready      = CustomError{Code: "R003A", Name: "user have assitence request"}
	AssistanceImagesDuplicate = CustomError{Code: "R004A", Name: "images is duplicate"}
	AssistanceIsUsed          = CustomError{Code: "R005A", Name: "assistance is used"}
	DriversNotFound           = CustomError{Code: "R006A", Name: "not find drivers"}
	AssitenceNotAvailable     = CustomError{Code: "R007A", Name: "driver is not available"}
	AssistanceDriverNotExist  = CustomError{Code: "R008A", Name: "driver not have request"}
	DriverNotFound            = CustomError{Code: "R009A", Name: "Driver Not Found"}
	RoutesNotFound            = CustomError{Code: "R0010A", Name: "There are no routes"}
	PriceNotFound             = CustomError{Code: "R0012A", Name: "There are no routes"}
	StatusNotFound            = CustomError{Code: "R032E", Name: "status not found"}
	InvalidFormatImg          = CustomError{Code: "R033E", Name: "invalid format images"}
	CompanyNotFound           = CustomError{Code: "R034E", Name: "company not found"}
	Duplicate                 = CustomError{Code: "R035E", Name: "Duplicate Name"}
	CountryNotFound           = CustomError{Code: "R036E", Name: "country not found"}
	ErrorCreateUserWs         = CustomError{Code: "R037E", Name: "error create user ws"}
)

func NewCustomErrMsg(cError *CustomError, message string) *CustomError {
	return &CustomError{
		Code:    cError.Code,
		Name:    cError.Name,
		Message: &message,
	}
}

func NewCustomError(code, name, message string) *CustomError {
	return &CustomError{
		Code:    code,
		Name:    name,
		Message: &message,
	}
}
