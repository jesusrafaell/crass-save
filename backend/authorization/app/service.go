package app

import (
	"context"
	"fmt"
	"log"

	"github.com/go-redis/redis/v8"
)

type Authorization struct {
	token      *tokenService
	session    *sessionService
	StoreRedis *redis.Client
}

func NewAuthorization(host, port string) *Authorization {
	storeRedis, err := NewClientRedis(host, port)
	if err != nil {
		log.Fatalf("Error auth(Redis): %v", err)
	}
	return &Authorization{
		token:      newTokenService(),
		session:    newSessionssService(storeRedis),
		StoreRedis: storeRedis,
	}
}

func (s *Authorization) GenerateToken(claims *Claims, expHours uint32) (string, *ErrorAuth) {
	token, err := s.token.GenerateToken(claims, expHours)
	if err != nil {
		return "", ErrDefault
	}
	return token, nil
}

func (s *Authorization) VerifyToken(token string) (*Claims, *ErrorAuth) {
	claims, err := s.token.VerifyToken(token)
	if err != nil {
		return nil, ErrInvalidToken
	}
	return claims, nil
}

func (s *Authorization) GenerateSession(claims *Claims, expHours uint32) (string, *ErrorAuth) {
	sessionId := GenerateSessionID()
	if err := s.session.Create(claims.UserID, sessionId); err != nil {
		return "", ErrDefault
	}

	claims.SessionID = sessionId
	token, err := s.token.GenerateToken(claims, expHours)
	if err != nil {
		return "", ErrDefault
	}

	return token, nil
}

func (s *Authorization) RefreshSession(userId string, claims *Claims, expHours uint32) (string, *ErrorAuth) {
	sessionId, errAuth := s.GetSession(userId)
	if errAuth != nil || sessionId == "" {
		sessionId = GenerateSessionID()
	}

	if err := s.session.Create(userId, sessionId); err != nil {
		return "", ErrDefault
	}

	claims.SessionID = sessionId
	claims.UserID = userId
	token, err := s.token.GenerateToken(claims, expHours)
	if err != nil {
		return "", ErrDefault
	}

	return token, nil
}

// Obtener una sesión existente del usuario
func (s *Authorization) GetSession(userId string) (string, *ErrorAuth) {
	sessionId, err := s.session.GetSession(userId)
	if err != nil || sessionId == "" {
		return "", ErrSessionNotFound
	}
	return sessionId, nil
}

func (s *Authorization) VerifySession(token string, ignore bool) (*Claims, *ErrorAuth) {
	claims, err := s.token.VerifyToken(token)
	if err != nil {
		return nil, ErrInvalidToken
	}

	// Saltar la verificación de session para web
	if claims.RoleKey == "2" || ignore {
		// web
		// log.Printf("WEB: %s | ignoreSession: %t", claims.Email, ignore)
		// ignore
		// log.Printf("MOBILE: %s | ignoreSession: %t", claims.Email, ignore)
		return claims, nil
	}

	sessionId, err := s.session.GetSession(claims.UserID)

	if err != nil || claims.SessionID != sessionId {
		return nil, ErrSessionNotFound
	}
	// if claims.SessionID != sessionId {
	// 	fmt.Printf("MOBILE(E): %s | sessionID: %s\n", claims.Email, sessionId)
	// 	return nil, ErrSessionNotFound
	// }

	fmt.Printf("MOBILE(S): %s | sessionID: %s\n", claims.Email, sessionId)

	return claims, nil
}

func (s *Authorization) DeleteSession(ctx context.Context, userId string) *ErrorAuth {
	err := s.session.Delete(userId)
	if err != nil {
		return ErrSessionNotFound
	}
	return nil
}

func (s *Authorization) CloseSession(token string) (*Claims, *ErrorAuth) {
	claims, err := s.token.VerifyToken(token)
	if err != nil {
		return nil, ErrInvalidToken
	}
	if errC := s.DeleteSession(context.Background(), claims.UserID); errC != nil {
		return nil, errC
	}
	return claims, nil
}
