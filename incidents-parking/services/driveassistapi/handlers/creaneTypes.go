package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/labstack/echo/v4"
)

type CraneTypesHandler struct {
	service services.CraneTypeService
}

func NewCraneTypesHandler(s services.CraneTypeService) *CraneTypesHandler {
	return &CraneTypesHandler{
		service: s,
	}
}

func (vh *CraneTypesHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	list, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := []types.BaseName{}
	for _, t := range *list {
		res = append(res, *util.CraneTypeToBase(&t, lang))
	}
	return ResponseSuccess(c, "List crane types", res)
}
