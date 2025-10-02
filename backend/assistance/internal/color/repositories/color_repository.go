package repositories

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/color/models"

	"github.com/jmoiron/sqlx"
)

type ColorRepository interface {
	GetAll(lang string) (*[]models.Color, error)
}

type colorRepository struct {
	db *sqlx.DB
}

func NewColorRepository(db *sqlx.DB) ColorRepository {
	return &colorRepository{db: db}
}

func (repo *colorRepository) GetAll(lang string) (*[]models.Color, error) {
	var colors []models.Color
	sql := fmt.Sprintf(`
		SELECT 
			id, 
			%s as name, 
			hex 
		FROM a_colors 
		WHERE LOWER(en) != 'none'
		ORDER BY name ASC`, lang)

	err := repo.db.Select(&colors, sql)
	return &colors, err
}
