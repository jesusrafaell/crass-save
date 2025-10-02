package handlers

import (
	"bitbucket.org/mya/mya-assistance-core/internal/enginetype/usecases"
	"bitbucket.org/mya/mya-assistance-core/internal/responses"

	"github.com/labstack/echo/v4"
)

type EngineTypeHandler interface {
	HandleGetAll(c echo.Context) error
}

type engineTypeHandler struct {
	engineTypeUsecase usecases.EngineTypeUsecase
}

func NewEngineTypeHandler(engineTypeUsecase usecases.EngineTypeUsecase) EngineTypeHandler {
	return &engineTypeHandler{
		engineTypeUsecase: engineTypeUsecase,
	}
}

func (h *engineTypeHandler) HandleGetAll(c echo.Context) error {
	engineTypes, err := h.engineTypeUsecase.GetAll(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Success(c, "list engine types", engineTypes)
}
