package models

import (
	"bitbucket.org/mya/mya-assistance-core/types"
	"github.com/google/uuid"
)

// model
type Company struct {
	ID          uuid.UUID       `db:"id" json:"id"`
	Name        string          `db:"name" json:"name"`
	Key         uint            `db:"key" json:"key"`
	Description string          `db:"description" json:"description"`
	Email       string          `db:"email" json:"email"`
	Mobile      string          `db:"mobile" json:"mobile"`
	Active      bool            `db:"active" json:"active"`
	Location    *types.Location `db:"location" json:"location,omitempty"`
}

func (Company) TableName() string {
	return "u_companies"
}

type CompanyInfo struct {
	ID          uuid.UUID `db:"id" json:"id"`
	Name        string    `db:"name" json:"name"`
	Key         uint      `db:"key" json:"key"`
	Description string    `db:"description" json:"description"`
	Email       string    `db:"email" json:"email"`
	Mobile      string    `db:"mobile" json:"mobile"`
	Active      bool      `db:"active" json:"active"`
	TotalUser   uint64    `db:"total_user" json:"totalUser"`
	TotalDriver uint64    `db:"total_driver" json:"totalDriver"`
}

type CompanyResponse struct {
	ID   uuid.UUID `db:"id" json:"id"`
	Name string    `db:"name" json:"name"`
	Key  uint      `db:"key" json:"key"`
}
