package handlers

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/services"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type CompanyHandler struct {
	service services.CompanyService
}

func NewCompanyHandler(service services.CompanyService) *CompanyHandler {
	return &CompanyHandler{
		service,
	}
}

func (ch *CompanyHandler) GetList(c echo.Context) error {
	res, err := ch.service.ListCompanies()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "list companies", res)
}

func (ch *CompanyHandler) GetByID(c echo.Context) error {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return ResponseBadRequest(c, "invalid UUID format")
	}
	res, err := ch.service.GetByID(id)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "data parking", res)
}

func (ch *CompanyHandler) Create(c echo.Context) error {
	var req data.Company

	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	err := ch.service.Create(&req)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseCreated(c)
}
