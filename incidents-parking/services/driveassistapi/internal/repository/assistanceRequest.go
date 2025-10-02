package repository

import (
	"api/driveassist/data/model"
	codeError "api/driveassist/util/errorcodes"
	"log"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AssistanceRequest struct {
	db *gorm.DB
}

func NewAssistanceReqRepository(db *gorm.DB) *AssistanceRequest {
	return &AssistanceRequest{db: db}
}

func (repo *AssistanceRequest) Create(data *model.AssistanceRequest) *codeError.CustomError {
	result := repo.db.Create(data)
	if result.Error != nil {
		log.Println(result.Error)
		return parseAssistanceError(result.Error)
	}
	return nil
}

func (repo *AssistanceRequest) GetByID(id uuid.UUID) (*model.AssistanceRequest, error) {
	var data model.AssistanceRequest
	result := repo.db.First(&data, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func (repo *AssistanceRequest) GetByUserID(userId uuid.UUID) (*model.AssistanceRequest, error) {
	var data model.AssistanceRequest
	result := repo.db.Joins("JOIN status ON status.id = dat_assistancerequest.status_id AND status.en = ?", "active").
		Where("user_id = ?", userId).Preload("Status").
		First(&data)
	if result.Error != nil {
		log.Println(result.Error)
		return nil, result.Error
	}

	return &data, nil
}

func (repo *AssistanceRequest) GetAll() (*[]model.AssistanceRequest, error) {
	var list []model.AssistanceRequest
	result := repo.db.
		Preload("Vehicle").
		Preload("Status").
		Order("created_at ASC").
		Find(&list)
	return &list, result.Error
}

func (repo *AssistanceRequest) Update(data *model.AssistanceRequest) error {
	result := repo.db.Save(&data)
	return result.Error
}

func (repo *AssistanceRequest) Delete(id uuid.UUID) error {
	result := repo.db.Delete(&model.AssistanceRequest{}, id)
	return result.Error
}

func (repo *AssistanceRequest) GetByUserAndStatus(userId uuid.UUID, statusID uuid.UUID) (*model.AssistanceRequest, error) {
	var data model.AssistanceRequest
	result := repo.db.Where("user_id = ? and status_id = ?", userId, statusID).First(&data)
	if result.Error != nil {
		return nil, result.Error
	}
	return &data, nil
}

func parseAssistanceError(err error) *codeError.CustomError {
	//duplicates
	if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
		switch {
		case strings.Contains(err.Error(), "\"idx_dat_assistancerequest_image_path1\""):
			return codeError.NewCustomError("assistanceImagesDuplicate")
		case strings.Contains(err.Error(), "\"idx_dat_assistancerequest_image_path2\""):
			return codeError.NewCustomError("assistanceImagesDuplicate")
		case strings.Contains(err.Error(), "\"idx_dat_assistancerequest_image_path3\""):
			return codeError.NewCustomError("assistanceImagesDuplicate")
		case strings.Contains(err.Error(), "\"idx_dat_assistancerequest_image_path4\""):
			return codeError.NewCustomError("assistanceImagesDuplicate")
		}
	}
	errorData := codeError.NewCustomError("assistRequestFail")
	errorData.Name = err.Error()
	return errorData
}
