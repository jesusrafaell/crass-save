package handlers

import (
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/insurance/usecases"
	"bitbucket.org/mya/mya-assistance-core/internal/responses"

	"github.com/labstack/echo/v4"
)

type InsuranceHandler interface {
	Create(c echo.Context) error
	GetList(c echo.Context) error
}

type insuranceHandler struct {
	insurancesUsecase usecases.InsurancesUsecase
}

func NewInsuranceHandler(insurancesUsecase usecases.InsurancesUsecase) InsuranceHandler {
	return &insuranceHandler{
		insurancesUsecase: insurancesUsecase,
	}
}

func (h *insuranceHandler) Create(c echo.Context) error {
	req := new(models.AddInsuranceRequest)
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	err := h.insurancesUsecase.Create(c.Request().Context(), req)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Created(c)
}

func (h *insuranceHandler) GetList(c echo.Context) error {
	countryId := c.QueryParam("countryId")
	if countryId != "" {
		insurances, err := h.insurancesUsecase.GetByCountryID(c.Request().Context(), countryId)
		if err != nil {
			return responses.BadRequest(c, err.Error())
		}
		return responses.Success(c, "List Insurances", insurances)
	} else {
		insurancesCountries, err := h.insurancesUsecase.GetWithCountries(c.Request().Context())
		if err != nil {
			return responses.BadRequest(c, err.Error())
		}
		return responses.Success(c, "List Insurances with Countries", insurancesCountries)
	}
}
