package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/labstack/echo/v4"
)

type DriveTrainTypeHandler struct {
	service services.DriveTrainTypeService
}

func NewDriveTrainTypeHandler(s services.DriveTrainTypeService) *DriveTrainTypeHandler {
	return &DriveTrainTypeHandler{
		service: s,
	}
}

func (vh *DriveTrainTypeHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	dttypes, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := []types.BaseName{}
	for _, i := range *dttypes {
		res = append(res, *util.DriveTrainToBase(&i, lang))
	}
	return ResponseSuccess(c, "List Drive Train Types", res)
}
