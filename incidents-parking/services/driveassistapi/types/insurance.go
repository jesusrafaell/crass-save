package types

import (
	"github.com/google/uuid"
)

type InsuranceRequest struct {
	Name      string      `json:"name"`
	Countries []uuid.UUID `json:"contries"`
}

type InsuranceResponse struct {
	ID        uuid.UUID  `json:"id"`
	CreatedAt int64      `json:"createdAt"`
	UpdatedAt int64      `json:"updatedAt"`
	Name      string     `json:"name"`
	Countries []BaseName `json:"countries"`
}
