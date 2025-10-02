package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"

	"github.com/labstack/echo/v4"
)

type ModelHandler struct {
	service services.ModelService
}

func NewsModelHandler(s services.ModelService) *ModelHandler {
	return &ModelHandler{
		service: s,
	}
}

func (mh *ModelHandler) GetList(c echo.Context) error {
	brandId := c.QueryParam("brandId")
	models, err := mh.service.GetByBrandID(brandId)
	if err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	res := []types.BaseName{}
	for _, i := range *models {
		newItem := types.BaseName{
			ID:   i.ID,
			Name: i.Name,
		}
		res = append(res, newItem)
	}
	return ResponseSuccess(c, "List models", res)
}

func (mh *ModelHandler) Create(c echo.Context) error {
	var req types.ModelRquest
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}
	_, err := mh.service.CreateModel(req)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseCreated(c, "Model Created")
}
