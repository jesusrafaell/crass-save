package handlers

import (
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/models"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/usecases"
	"bitbucket.org/mya/mya-assistance-core/internal/responses"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type RatePriceHandler interface {
	GetList(c echo.Context) error
	GetTypesRatePrice(c echo.Context) error
	Update(c echo.Context) error
	GetPriceXKm(c echo.Context) error
}

type ratePriceHandler struct {
	ratePriceUsecase usecases.RatePriceUsecase
}

func NewRatePriceHandler(ratePriceUsecase usecases.RatePriceUsecase) RatePriceHandler {
	return &ratePriceHandler{
		ratePriceUsecase: ratePriceUsecase,
	}
}

// func (ch *RatePriceHandler) Create(c echo.Context) error {
// 	var price RatePriceXType
// 	if err := c.Bind(&price); err != nil {
// 		return responses.InternalServerError(c, err.Error())
// 	}

// 	// validator
// 	validate := validator.New()
// 	if err := validate.Struct(price); err != nil {
// 		return responses.InternalServerError(c, err.Error())
// 	}

// 	err := ch.service.Create(&price)
// 	if err != nil {
// 		return responses.CodeError(c, err)
// 	}

// 	return responses.Created(c)
// }

func (h *ratePriceHandler) GetList(c echo.Context) error {
	res, err := h.ratePriceUsecase.GetAll(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List Price Rate", res)
}

func (h *ratePriceHandler) GetTypesRatePrice(c echo.Context) error {
	res, err := h.ratePriceUsecase.GetTypeRatePrices(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List Price Rate Types", res)
}

func (h *ratePriceHandler) Update(c echo.Context) error {
	req := new(models.UpdateRatePriceXType)
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	idStr := c.Param("id")
	id, errParse := uuid.Parse(idStr)
	if errParse != nil {
		return responses.InternalServerError(c, errParse.Error())
	}

	err := h.ratePriceUsecase.Update(c.Request().Context(), id, req)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Updated(c)
}

func (h *ratePriceHandler) GetPriceXKm(c echo.Context) error {
	req := new(models.GetPriceXKmRequest)
	// transform
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	res, err := h.ratePriceUsecase.GetPriceXKm(c.Request().Context(), req.TypeId, req.DistanceMeters)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "Price by Type & Dist", res)
}
