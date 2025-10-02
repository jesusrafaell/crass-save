package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/labstack/echo/v4"
)

type WeightsHandler struct {
	service services.WeightService
}

func NewWeightHandler(s services.WeightService) *WeightsHandler {
	return &WeightsHandler{
		service: s,
	}
}

func (vh *WeightsHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	list, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := []types.BaseName{}
	for _, i := range *list {
		res = append(res, *util.WeightToBase(&i, lang))
	}
	return ResponseSuccess(c, "List Weights", res)
}
