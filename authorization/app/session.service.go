package app

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
)

func GenerateSessionID() string {
	return uuid.New().String()
}

type sessionService struct {
	store      *redis.Client
	prefix     string
	ExpSession time.Duration
	ctx        context.Context
}

// Create a new session service
func newSessionssService(store *redis.Client) *sessionService {
	return &sessionService{
		store:      store,
		prefix:     "session:",
		ExpSession: 30 * 24 * time.Hour,
		ctx:        context.Background(),
	}
}

// Create a new session
func (s *sessionService) Create(userId string, sessionId string) error {
	sessionKey := s.prefix + userId

	// Guardar la sesión con un timeout de 5 segundos para evitar bloqueos
	ctx, cancel := context.WithTimeout(s.ctx, 5*time.Second)
	defer cancel()

	if err := s.saveSession(ctx, sessionKey, sessionId); err != nil {
		return fmt.Errorf("error saving session: %v", err)
	}
	return nil
}

func (s *sessionService) GetSession(userId string) (string, error) {
	sessionKey := s.prefix + userId

	// Obtener sesión con un timeout de 3 segundos
	ctx, cancel := context.WithTimeout(s.ctx, 3*time.Second)
	defer cancel()

	sessionId, err := s.store.Get(ctx, sessionKey).Result()
	if err == redis.Nil {
		return "", nil // Sesión no encontrada
	} else if err != nil {
		return "", err // Otro error de Redis
	}

	return sessionId, nil
}

// Verificar la validez de la sesión
func (s *sessionService) VerifySession(userId string, sessionId string) (bool, error) {
	storedSessionId, err := s.GetSession(userId)
	if err != nil {
		return false, err
	}
	return storedSessionId == sessionId, nil
}

// Eliminar sesión del usuario
func (s *sessionService) Delete(userId string) error {
	sessionKey := s.prefix + userId

	// Eliminar la sesión con un timeout de 2 segundos
	ctx, cancel := context.WithTimeout(s.ctx, 2*time.Second)
	defer cancel()

	if err := s.store.Del(ctx, sessionKey).Err(); err != nil {
		return fmt.Errorf("error deleting user session: %v", err)
	}

	return nil
}

// Guardar sesión en Redis
func (s *sessionService) saveSession(ctx context.Context, sessionKey string, sessionId string) error {
	fmt.Printf("[SessionID: %s, SessionKey: %s]\n", sessionId, sessionKey)

	// Guardar la sesión con expiración definida
	return s.store.Set(ctx, sessionKey, sessionId, s.ExpSession).Err()
}
