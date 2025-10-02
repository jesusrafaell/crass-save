package entities

import (
	"bitbucket.org/mya/mya-assistance-core/internal/country/models"
	"github.com/google/uuid"
)

type Country struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;default:uuid_generate_v4()" json:"id" db:"id"`
	CreatedAt int64     `gorm:"column:created_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"createdAt,omitempty" db:"created_at"`
	UpdatedAt int64     `gorm:"column:updated_at;not null;default:EXTRACT(epoch FROM CURRENT_TIMESTAMP)" json:"updatedAt,omitempty" db:"updated_at"`
	DeletedAt *int64    `gorm:"index" json:"deletedAt,omitempty" db:"deleted_at"`
	ES        *string   `db:"es,omitempty" json:"es,omitempty"`
	EN        *string   `db:"en,omitempty" json:"en,omitempty"`

	//Response
	Name string `db:"name" json:"name"`
}

func CountryToBase(country *Country, lang string) *models.Country {
	if country == nil {
		return nil
	}
	item := models.Country{
		ID: country.ID,
	}
	if lang == "en" {
		item.Name = *country.EN
	} else {
		item.Name = *country.ES
	}
	return &item
}
