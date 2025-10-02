package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type VehicleHandler struct {
	service services.VehicleService
}

func NewVehicleHandler(s services.VehicleService) *VehicleHandler {
	return &VehicleHandler{
		service: s,
	}
}

func (vh *VehicleHandler) CreateByUser(c echo.Context) error {
	userIdStr := c.Get("userId").(string)
	var req types.VehicleRequest

	userId, _ := uuid.Parse(userIdStr)
	req.UserID = userId

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

	return ResponseCreated(c, "Vehicle Created")
}

func (vh *VehicleHandler) GetListByUser(c echo.Context) error {
	lang := c.Get("lang").(string)
	userId := c.Get("userId").(string)
	vehicles, err := vh.service.GetByUserID(userId)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := make([]types.VehicleResponse, 0, len(*vehicles))
	for _, v := range *vehicles {
		res = append(res, *util.ConvertVehicleToVehicleResponse(v, lang))
	}
	return ResponseSuccess(c, "List Vehicle", res)
}

func (vh *VehicleHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	vehicles, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := make([]types.VehicleResponse, 0, len(*vehicles))
	for _, v := range *vehicles {
		res = append(res, *util.ConvertVehicleToVehicleResponse(v, lang))
	}
	return ResponseSuccess(c, "List Vehicle", res)
}

func (vh *VehicleHandler) Update(c echo.Context) error {
	var req types.VehicleRequest
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	id := c.Param("id")
	if err := vh.service.Update(id, req); err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	return ResponseSuccess(c, "Vehicle Updated", nil)
}

func (vh *VehicleHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := vh.service.Delete(id); err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "Vehicle Deleted", c.Param("id"))
}

func (vh *VehicleHandler) Create(c echo.Context) error {
	var req types.VehicleRequest

	// transform
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
		// return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
		// return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	userId := c.Get("userId").(uuid.UUID)

	req.UserID = userId

	if errCustom := vh.service.Create(req); errCustom != nil {
		return ResponseCodeError(c, errCustom)
	}

	return ResponseCreated(c, "Vehicle Created")
}
