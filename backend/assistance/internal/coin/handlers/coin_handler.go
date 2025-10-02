package handlers

import (
	"bitbucket.org/mya/mya-assistance-core/internal/coin/usecases"
	"bitbucket.org/mya/mya-assistance-core/internal/responses"

	"github.com/labstack/echo/v4"
)

type CoinHandler interface {
	GetList(c echo.Context) error
}

type coinHandler struct {
	coinUsecase usecases.CoinUsecase
}

func NewCoinsHandler(coinUsecase usecases.CoinUsecase) CoinHandler {
	return &coinHandler{
		coinUsecase: coinUsecase,
	}
}

func (h *coinHandler) GetList(c echo.Context) error {
	res, err := h.coinUsecase.GetAll(c.Request().Context())
	if err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	return responses.Success(c, "List coins", res)
}
