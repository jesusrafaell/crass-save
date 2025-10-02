package errs

import "fmt"

// CustomError is a struct that holds an error code and message.
type CustomError struct {
	Code    string  `json:"error"`
	Name    string  `json:"name"`
	Message *string `json:"message"`
}

// Error implements the error interface for errs.
func (e CustomError) Error() string {
	return fmt.Sprintf(e.Code)
}

var (
	InvalidRequest     = CustomError{Code: "R000", Name: "Invalid request format"}
	ErrorServer        = CustomError{Code: "R001", Name: "Error in server"}
	UserNotFound       = CustomError{Code: "R000E", Name: "User not found"}
	Required           = CustomError{Code: "R001E", Name: "Required field, not provided."}
	String             = CustomError{Code: "R002E", Name: "The field must be a string."}
	Number             = CustomError{Code: "R003E", Name: "The field must be a numeric value."}
	Long               = CustomError{Code: "R004E", Name: "The field's length does not meet the specified requirements."}
	Empty              = CustomError{Code: "R005E", Name: "The field must not be empty."}
	EmailExist         = CustomError{Code: "R014E", Name: "Email already exists"}
	IdentTypeNotFound  = CustomError{Code: "R015E", Name: "Identification Type Not Found"}
	MobileExist        = CustomError{Code: "R016E", Name: "Mobile already exists"}
	ExpToken           = CustomError{Code: "R017E", Name: "Token expired"}
	UnverifiedAccount  = CustomError{Code: "R020E", Name: "Unverified Account"}
	DuplicateImagePath = CustomError{Code: "R022E", Name: "Image path duplicate"}
	InvalidCredentials = CustomError{Code: "R023E", Name: "Invalid Credentials"}
	UserSuspended      = CustomError{Code: "R025E", Name: "Account suspended"}
	RoleNotFound       = CustomError{Code: "R028E", Name: "Role not found"}
	ExpiredAccess      = CustomError{Code: "R030E", Name: "Access expired"}
	StatusNotFound     = CustomError{Code: "R032E", Name: "Status not found"}
	OSNotFound         = CustomError{Code: "R033E", Name: "OS not found"}
	NotAccess          = CustomError{Code: "R031E", Name: "Not authorized"}
	CompanyNotFound    = CustomError{Code: "R032E", Name: "Company not found"}
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
