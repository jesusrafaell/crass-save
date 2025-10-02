package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type TowTruckHandler struct {
	service services.TowTruckService
}

func NewTowTruckHandler(s services.TowTruckService) *TowTruckHandler {
	return &TowTruckHandler{
		service: s,
	}
}

func (vh *TowTruckHandler) CreateByUser(c echo.Context) error {
	userIdStr := c.Get("userId").(string)
	var req types.TowTruckRequest

	userId, _ := uuid.Parse(userIdStr)
	req.UserID = userId
	//valid
	req.OwnerID = userId

	// transform
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	if errCustom := vh.service.Create(req); errCustom != nil {
		return ResponseCodeError(c, errCustom)
	}

	return ResponseCreated(c, "TowTruck Created")
}

func (vh *TowTruckHandler) GetListByUser(c echo.Context) error {
	lang := c.Get("lang").(string)
	userId := c.Get("userId").(string)
	towTrucks, err := vh.service.GetByUserID(userId)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := make([]types.TowTruckResponse, 0, len(*towTrucks))
	for _, v := range *towTrucks {
		res = append(res, *util.ConvertTowTruckResponse(v, lang))
	}
	return ResponseSuccess(c, "List TowTrucks", res)
}

func (vh *TowTruckHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	towTrucks, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := make([]types.TowTruckResponse, 0, len(*towTrucks))
	for _, v := range *towTrucks {
		res = append(res, *util.ConvertTowTruckResponse(v, lang))
	}
	return ResponseSuccess(c, "List TowTrucks", res)
}

func (vh *TowTruckHandler) Update(c echo.Context) error {
	var req types.TowTruckRequest
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	id := c.Param("id")
	if err := vh.service.Update(id, req); err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	return ResponseSuccess(c, "TowTruck Updated", nil)
}

func (vh *TowTruckHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := vh.service.Delete(id); err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "TowTruck Deleted", c.Param("id"))
}

// func (vh *TowTruckHandler) Create(c echo.Context) error {
// 	var req types.VehicleRequest

// 	// transform
// 	if err := c.Bind(&req); err != nil {
// 		return ResponseInternalServerError(c, err.Error())
// 		// return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
// 	}

// 	// validator
// 	validate := validator.New()
// 	if err := validate.Struct(req); err != nil {
// 		return ResponseInternalServerError(c, err.Error())
// 		// return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
// 	}

// 	userId := c.Get("userId").(uuid.UUID)

// 	req.UserID = userId

// 	if errCustom := vh.service.Create(req); errCustom != nil {
// 		return ResponseCodeError(c, errCustom)
// 	}

// 	return ResponseCreated(c, "TowTruck Created")
// }
