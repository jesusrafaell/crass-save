package handlers

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/services"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type LicensePlateXCompanyHandler struct {
	service services.LicensePlateXCompanyService
}

func NewLicensePlateXCompanyHandler(service services.LicensePlateXCompanyService) *LicensePlateXCompanyHandler {
	return &LicensePlateXCompanyHandler{
		service,
	}
}

func (lxch *LicensePlateXCompanyHandler) ListByCompanyId(c echo.Context) error {
	idStr := c.Param("companyId")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return ResponseBadRequest(c, "invalid UUID format")
	}
	res, err := lxch.service.ListByCompanyId(id)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "list licenseplatexcompany", res)

}

func (lxch *LicensePlateXCompanyHandler) Create(c echo.Context) error {
	var req data.LicensePlateXCompany

	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	err := lxch.service.Create(&req)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseCreated(c)
}
