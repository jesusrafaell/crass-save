package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/labstack/echo/v4"
)

type CountryHandler struct {
	service services.CountryService
}

func NewCountryHandler(s services.CountryService) *CountryHandler {
	return &CountryHandler{
		service: s,
	}
}

func (vh *CountryHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	countries, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	res := []types.BaseName{}
	for _, i := range *countries {
		res = append(res, *util.CountryToBase(&i, lang))
	}
	return ResponseSuccess(c, "List Colors", res)
}
