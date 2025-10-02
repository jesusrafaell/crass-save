package handlers

import (
	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/internal/weight/usecases"

	"github.com/labstack/echo/v4"
)

type WeightsHandler interface {
	GetList(c echo.Context) error
}

type weightsHandler struct {
	weightUsecase usecases.WeightUsecase
}

func NewWeightHandler(weightUsecase usecases.WeightUsecase) WeightsHandler {
	return &weightsHandler{
		weightUsecase: weightUsecase,
	}
}

func (h *weightsHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	Weights, err := h.weightUsecase.GetAll(lang)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List Weights", Weights)
}
