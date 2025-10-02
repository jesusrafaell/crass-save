package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/labstack/echo/v4"
)

type TypesHandler struct {
	service services.TypeService
}

func NewTypesHandler(s services.TypeService) *TypesHandler {
	return &TypesHandler{
		service: s,
	}
}

func (vh *TypesHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	list, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := []types.BaseName{}
	for _, t := range *list {
		res = append(res, *util.TypeToBase(&t, lang))
	}
	return ResponseSuccess(c, "List types", res)
}
