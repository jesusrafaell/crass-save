package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/labstack/echo/v4"
)

type TypesMachineHandler struct {
	service services.TypeMachineService
}

func NewTypesMachineHandler(s services.TypeMachineService) *TypesMachineHandler {
	return &TypesMachineHandler{
		service: s,
	}
}

func (vh *TypesMachineHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	list, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := []types.BaseName{}
	for _, i := range *list {
		res = append(res, *util.TypeMachineToBase(&i, lang))
	}
	return ResponseSuccess(c, "List types Machine", res)
}
