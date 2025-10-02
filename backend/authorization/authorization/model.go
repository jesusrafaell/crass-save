package authorization

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	SessionID  string `json:"sessionID"`
	UserID     string `json:"userID"`
	Email      string `json:"email"`
	RoleKey    string `json:"roleKey"`
	CompanyKey string `json:"companyKey"`
	OS         string `json:"os"`
	CreatedAt  int64  `json:"createdAt"`
	jwt.RegisteredClaims
}

type SessionUser struct {
	UserID    string `json:"userId"`
	SessionID string `json:"sessionId"`
	RoleKey   string `json:"roleKey"`
	OS        string `json:"os"`
	CreatedAt int64  `json:"createdAt"`
}

type ErrorAuth struct {
	Code string `json:"error"`
	Name string `json:"name"`
}

func (e ErrorAuth) Error() string {
	return fmt.Sprintf("[%s] %s", e.Code, e.Name)
}

var (
	ErrDefault         = &ErrorAuth{Code: "R001", Name: "Auth (default)"}
	ErrExpiredToken    = &ErrorAuth{Code: "R030E", Name: "Token has expired"}
	ErrInvalidToken    = &ErrorAuth{Code: "R017E", Name: "Invalid authorization token"}
	ErrSessionNotFound = &ErrorAuth{Code: "R026E", Name: "There is no session with this token"}
)
