package models

import "bitbucket.org/mya/mya-assistance-core/types"

type CreateCompany struct {
	Name        string         `json:"name" validate:"required"`
	Description string         `json:"description" validate:"required"`
	Email       string         `json:"email" validate:"required"`
	Mobile      string         `json:"mobile" validate:"required"`
	Active      bool           `json:"active"`
	Location    types.Location `json:"location,omitempty" validate:"required"`
}
