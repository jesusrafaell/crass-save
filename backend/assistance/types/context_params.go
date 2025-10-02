package types

import "github.com/google/uuid"

type HeaderContext struct {
	Lang       string
	UserID     uuid.UUID
	RoleKey    uint
	CompanyKey uint
	OS         string
}

type ContextKey string

const UserContextKey ContextKey = "USER_CONTEXT"
