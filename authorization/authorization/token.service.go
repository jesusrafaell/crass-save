package authorization

import (
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type tokenService struct {
	secretKey       []byte
	defaultExpHours uint32
}

func newTokenService() *tokenService {
	secret := os.Getenv("SECRETKEY")
	return &tokenService{
		secretKey:       []byte(secret),
		defaultExpHours: 720, // 1 mes (30 días)
	}
}

func (s *tokenService) GenerateToken(data *Claims, expHours uint32) (string, error) {
	claims := Claims{
		SessionID:  data.SessionID,
		UserID:     data.UserID,
		Email:      data.Email,
		RoleKey:    data.RoleKey,
		CompanyKey: data.CompanyKey,
		OS:         data.OS,
		CreatedAt:  time.Now().Unix(),
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt: jwt.NewNumericDate(time.Now()),
		},
	}

	// Establecer el tiempo de expiración si se proporciona
	if expHours <= 0 {
		expHours = s.defaultExpHours
	}
	claims.ExpiresAt = jwt.NewNumericDate(time.Now().Add(time.Duration(expHours) * time.Hour))

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(s.secretKey)
	if err != nil {
		log.Printf("Error create token: %s", err.Error())
		return "", err
	}

	return tokenString, nil
}

func (s *tokenService) VerifyToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return s.secretKey, nil
	})
	if err != nil {
		return nil, fmt.Errorf("error parsing token: %v", err)
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid or expired token")
	}

	return &Claims{
		SessionID:  claims.SessionID,
		UserID:     claims.UserID,
		Email:      claims.Email,
		RoleKey:    claims.RoleKey,
		CompanyKey: claims.CompanyKey,
		OS:         claims.OS,
		CreatedAt:  claims.CreatedAt,
	}, nil
}
