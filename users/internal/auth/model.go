package auth

import (
	"appassistence/auth/errs"
	"appassistence/auth/pkg/assistance/vehicles"
	"appassistence/auth/pkg/users"

	"github.com/google/uuid"
)

type LoginResponse struct {
	User        *users.IUserLogin `json:"user"`
	Company     *users.CompanyU   `json:"company,omitempty"`
	DriverMode  *bool             `json:"driverMode,omitempty"`
	AccessToken string            `json:"access_token,omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	OS       string `json:"so"`
}

type RegisterUser struct {
	FirstName      string         `json:"first_name" validate:"required"`
	LastName       string         `json:"last_name" validate:"required"`
	Email          string         `json:"email" validate:"required,email"`
	Password       string         `json:"password" validate:"required"`
	Mobile         string         `json:"mobile" validate:"required"`
	UTC            string         `json:"utc" validate:"required"`
	Photo          string         `json:"photo" validate:"required"`
	Identification Identification `json:"identification" validate:"required"`
}

type Identification struct {
	Key            uint   `json:"key" validate:"required"`
	Path           string `json:"path" validate:"required"`
	DocumentNumber string `json:"documentNumber"`
}

type ForgotPassword struct {
	Email string `json:"email" validate:"required"`
}

type RegisterDriver struct {
	FirstName      string         `json:"first_name" validate:"required"`
	LastName       string         `json:"last_name" validate:"required"`
	Email          string         `json:"email" validate:"required,email"`
	Mobile         string         `json:"mobile" validate:"required"`
	UTC            string         `json:"utc" validate:"required"`
	Photo          string         `json:"photo" validate:"required"`
	Identification Identification `json:"identification" validate:"required"`
	CompanyId      uuid.UUID      `json:"companyId" validate:"required"`
}

type RegisterAdmin struct {
	FirstName string    `json:"firstName" validate:"required"`
	LastName  string    `json:"lastName" validate:"required"`
	Password  string    `json:"password" validate:"required"`
	Email     string    `json:"email" validate:"required,email"`
	Mobile    string    `json:"mobile" validate:"required"`
	Photo     string    `json:"photo" validate:"required"`
	UTC       string    `json:"utc" validate:"required"`
	CompanyId uuid.UUID `json:"companyId" validate:"required"`
}

type ErrorListDriver struct {
	Email string           `json:"email"`
	Error errs.CustomError `json:"error"`
}

type RegisterUserWs struct {
	FullName      string `json:"fullName" validate:"required"`
	DocIdent      string `json:"docIdent" validate:"required"`
	DoctIdentPath string `json:"doctIdentPath" validate:"required"`
	Mobile        string `json:"mobile" validate:"required"`
	Email         string `json:"email" validate:"required"`
}

type ChangePassword struct {
	Token    string `json:"token" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type VerifyInfoRequest struct {
	Token    string                   `json:"token" validate:"required"`
	User     users.UserUpdate         `json:"user" validate:"required"`
	Vehicles []vehicles.VehicleUpdate `json:"vehicles" validate:"required"`
}
