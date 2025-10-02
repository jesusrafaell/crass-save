package handlers

import (
	"bitbucket.org/mya/mya-assistance-core/internal/color/usecases"
	"bitbucket.org/mya/mya-assistance-core/internal/responses"

	"github.com/labstack/echo/v4"
)

type ColorHandler interface {
	GetList(c echo.Context) error
}

type colorHandler struct {
	colorUsecase usecases.ColorUsecase
}

func NewColorHandler(colorUsecase usecases.ColorUsecase) ColorHandler {
	return &colorHandler{
		colorUsecase: colorUsecase,
	}
}

func (h *colorHandler) GetList(c echo.Context) error {
	colors, err := h.colorUsecase.GetAll(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Success(c, "List Colors", colors)
}
