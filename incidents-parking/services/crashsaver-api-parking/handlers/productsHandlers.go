package handlers

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/services"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type ProductsHandler struct {
	service services.ProductsService
}

func NewsProductsHandler(service services.ProductsService) *ProductsHandler {
	return &ProductsHandler{service}
}

func (sh *ProductsHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	
	products, err := sh.service.GetList(lang)
	if err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	return ResponseSuccess(c, "List Products", products)
}

func (sh *ProductsHandler) PaymentCredits(c echo.Context) error {
	var req data.PaymentCredits
	lang := c.Get("lang").(string)
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	// validator que hace ??? 
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	res ,err := sh.service.PaymentCredits(&req, lang)
	
	
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "Resp Sadael", res)
}
