package test

import (
	"testing"

	"bitbucket.org/mya/mya-assistance-core/internal/color/models"
	"bitbucket.org/mya/mya-assistance-core/internal/color/tests/mocks"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestGetAllColors(t *testing.T) {
	mockRepo := new(mocks.MockColorRepository)

	mockColors := []models.Color{
		{ID: uuid.New(), Name: "Red", Hex: "#FF0000"},
		{ID: uuid.New(), Name: "Green", Hex: "#00FF00"},
		{ID: uuid.New(), Name: "Blue", Hex: "#0000FF"},
	}
	mockRepo.On("GetAll", "en").Return(&mockColors, nil)

	colors, err := mockRepo.GetAll("en")

	assert.NoError(t, err)
	assert.Equal(t, mockColors, *colors)
	assert.NoError(t, err)

	mockRepo.AssertExpectations(t)
}
