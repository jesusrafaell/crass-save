package entities

import (
	"bitbucket.org/mya/mya-assistance-core/pkg/users/models"
	"github.com/google/uuid"
)

type WsUser struct {
	ID                   uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id" db:"id"`
	IdentityDocument     string    `gorm:"type:varchar(255);not null" json:"identity_document" db:"identity_document"`
	Mobile               string    `gorm:"type:text;not null" json:"mobile" db:"mobile"`
	Email                string    `gorm:"type:text;unique;not null" json:"email" db:"email"`
	FirstName            string    `gorm:"type:varchar(150);not null" json:"first_name" db:"first_name"`
	LastName             string    `gorm:"type:varchar(150);not null" json:"last_name" db:"last_name"`
	IdentityDocumentPath *string   `gorm:"type:varchar(255)" json:"identity_document_path" db:"identity_document_path"`
	Active               bool      `gorm:"default:true" json:"active" db:"active"`
	CountryKey           uint      `gorm:"type:varchar(255)" json:"countryKey" db:"country_key"`

	// CreatedAt            int64     `gorm:"autoCreateTime:milli" json:"created_at" db:"created_at"`
	// UpdatedAt            int64     `gorm:"autoUpdateTime:milli" json:"updated_at" db:"updated_at"`
}

func (WsUser) TableName() string {
	return "ws_users"
}

func ConvertUserWSToModel(u *WsUser) *models.User {
	if u == nil {
		return nil
	}

	return &models.User{
		ID:        u.ID,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		Mobile:    u.Mobile,
		WS:        true,
		// Location:  types.ConvertLocationToLocationResponse(u.Location),
	}

}
