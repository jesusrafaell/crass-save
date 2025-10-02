package authorization

import (
	"context"
	"log"
)

type Authorization struct {
	token   *tokenService
	session *sessionService
}

func NewAuthorization() *Authorization {
	storeRedis, err := newClientRedis()
	if err != nil {
		log.Fatalf("Error auth(Redis): %v", err)
	}
	return &Authorization{
		token:   newTokenService(),
		session: newSessionssService(storeRedis),
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
	session := &SessionUser{
		SessionID: GenerateSessionID(),
		UserID:    claims.UserID,
		RoleKey:   claims.RoleKey,
		OS:        claims.OS,
		CreatedAt: claims.CreatedAt,
	}
	err := s.session.Create(context.Background(), session)
	if err != nil {
		return "", ErrDefault
	}

	claims.SessionID = session.SessionID
	token, err := s.token.GenerateToken(claims, expHours)
	if err != nil {
		return "", ErrDefault
	}

	return token, nil
}

func (s *Authorization) GetSession(ctx context.Context, userId string) (*SessionUser, *ErrorAuth) {
	session, err := s.session.GetSession(ctx, userId)
	if err != nil {
		return nil, ErrSessionNotFound
	}
	return session, nil
}

func (s *Authorization) VerifySession(ctx context.Context, token string, ignore bool) (*Claims, *ErrorAuth) {
	claims, err := s.token.VerifyToken(token)
	if err != nil {
		return nil, ErrInvalidToken
	}

	if claims.RoleKey == "2" {
		log.Printf("WEB: %s | ignoreSession: %t", claims.Email, ignore)
		return claims, nil
	}
	if ignore {
		log.Printf("MOBILE: %s | ignoreSession: %t", claims.Email, ignore)
		return claims, nil
	}

	sessionData, err := s.session.GetSession(ctx, claims.UserID)
	if err != nil {
		return nil, ErrSessionNotFound
	}
	if claims.SessionID != sessionData.SessionID {
		log.Printf("MOBILE(SessionNotFound): %s | sessionID: %s", claims.Email, sessionData.SessionID)
		return nil, ErrSessionNotFound
	}

	log.Printf("MOBILE(R): %s | ignoreSession: %t | sessionID: %s", claims.Email, ignore, sessionData.SessionID)

	return claims, nil
}

func (s *Authorization) DeleteSession(ctx context.Context, userId string) *ErrorAuth {
	err := s.session.Delete(ctx, userId)
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
