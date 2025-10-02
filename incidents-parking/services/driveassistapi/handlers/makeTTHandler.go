package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"

	"github.com/labstack/echo/v4"
)

type MakeTowTruckHandler struct {
	service services.MakeTowTruckService
}

func NewsMakeTowTruckHandler(s services.MakeTowTruckService) *MakeTowTruckHandler {
	return &MakeTowTruckHandler{
		service: s,
	}
}

func (vh *MakeTowTruckHandler) GetList(c echo.Context) error {
	makes, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := []types.BaseName{}
	for _, i := range *makes {
		newItem := types.BaseName{
			ID:   i.ID,
			Name: i.Name,
		}
		res = append(res, newItem)
	}

	return ResponseSuccess(c, "List Makes", res)
}
