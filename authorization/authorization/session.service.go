package authorization

import (
	"context"
	"encoding/json"
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
	ExpSession time.Duration
}

// Create a new session service
func newSessionssService(store *redis.Client) *sessionService {
	return &sessionService{
		store:      store,
		ExpSession: 30 * 24 * time.Hour,
	}
}

// Create a new session
func (s *sessionService) Create(ctx context.Context, payload *SessionUser) error {
	if err := s.saveSession(ctx, payload.UserID, payload); err != nil {
		return fmt.Errorf("error saving session: %v", err)
	}
	return nil
}

func (s *sessionService) Refresh(ctx context.Context, payload *SessionUser) error {
	sessionUser, err := s.GetSession(ctx, payload.UserID)
	if err != nil {
		return fmt.Errorf("error retrieving session: %v", err)
	}

	sessionUser.RoleKey = payload.RoleKey

	if err := s.saveSession(ctx, payload.UserID, sessionUser); err != nil {
		return fmt.Errorf("error saving updated session: %v", err)
	}

	return nil
}

func (s *sessionService) GetSession(ctx context.Context, userID string) (*SessionUser, error) {
	sessionData, err := s.store.Get(ctx, userID).Result()
	if err != nil {
		if err == redis.Nil {
			return nil, fmt.Errorf("session not found for user: %s", userID)
		}
		return nil, fmt.Errorf("error retrieving session from Redis: %v", err)
	}

	var sessionUser SessionUser
	if err = json.Unmarshal([]byte(sessionData), &sessionUser); err != nil {
		return nil, fmt.Errorf("error deserializing session: %v", err)
	}

	return &sessionUser, nil
}

func (s *sessionService) Delete(ctx context.Context, userID string) error {
	if err := s.store.Del(ctx, userID).Err(); err != nil {
		return fmt.Errorf("error deleting user session: %v", err)
	}

	return nil
}

func (s *sessionService) saveSession(ctx context.Context, userID string, sessionUser *SessionUser) error {
	sessionData, err := json.Marshal(sessionUser)
	if err != nil {
		return fmt.Errorf("error serializing session: %v", err)
	}

	fmt.Printf("New Session: [SessionID: %s, UserId: %s]\n", sessionUser.SessionID, sessionUser.UserID)
	return s.store.Set(ctx, userID, sessionData, s.ExpSession).Err()
}
