package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"

	"github.com/labstack/echo/v4"
)

type BrandHandler struct {
	service services.BrandService
}

func NewsBrandHandler(s services.BrandService) *BrandHandler {
	return &BrandHandler{
		service: s,
	}
}

func (vh *BrandHandler) GetList(c echo.Context) error {
	brands, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := []types.BaseName{}
	for _, i := range *brands {
		newItem := types.BaseName{
			ID:   i.ID,
			Name: i.Name,
		}
		res = append(res, newItem)
	}

	return ResponseSuccess(c, "List Brands", res)
}
