package handlers

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/services"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"

	"github.com/labstack/echo/v4"
)

type TpvHandler struct {
	service services.TpvService
}

func NewsTpvHandler(service services.TpvService) *TpvHandler {
	return &TpvHandler{service}
}

func (sh *TpvHandler) Payment(c echo.Context) error {
	var req data.Payment
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	// validator compara el req.body con este caso el data.Payment
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	res, err := sh.service.Payment(&req)

	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	return ResponseSuccess(c, "Sabadell resp", res)
}

func (sh *TpvHandler) Notification(c echo.Context) error {
	var req data.TransactionRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	// Convertir req a JSON con indentación
	reqJSON, err := json.MarshalIndent(req, "", "  ")
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error al convertir la solicitud a JSON")
	}

	fmt.Println(string(reqJSON))

	err2 := sh.service.Notification(req)
	if err2 != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err)
	}
	// fmt.Println("Request body in JSON format:")

	return ResponseMsgSuccess(c, "notification tpv successfully")
}
