package country

import (
	"bitbucket.org/mya/mya-assistance-core/internal/responses"

	"github.com/labstack/echo/v4"
)

type CountryHandler interface {
	GetList(c echo.Context) error
}

type countryHandler struct {
	usecase CountryUsecase
}

func NewCountryHandler(usecase CountryUsecase) CountryHandler {
	return &countryHandler{
		usecase: usecase,
	}
}

func (h *countryHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	countries, err := h.usecase.GetAll(lang)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List Colors", countries)
}
