package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/labstack/echo/v4"
)

type ColorHandler struct {
	service services.ColorService
}

func NewColorHandler(s services.ColorService) *ColorHandler {
	return &ColorHandler{
		service: s,
	}
}

func (vh *ColorHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	colors, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	res := []types.BaseColor{}
	for _, i := range *colors {
		res = append(res, *util.ColorToBase(&i, lang))
	}
	return ResponseSuccess(c, "List Colors", res)
}
