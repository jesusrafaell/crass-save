package handlers

import (
	"crashsaver/parking/types"
	"crashsaver/parking/util/customError"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

func ResponseCodeError(c echo.Context, err *customError.CustomError) error {
	return c.JSON(http.StatusBadRequest, types.ErrorResponse{
		Error: err.Code,
		Name:  err.Name,
		Ok:    false,
	})
}

func ResponseBadRequest(c echo.Context, err string) error {
	return c.JSON(http.StatusBadRequest, types.ErrorResponse{
		Error: strings.ReplaceAll(err, " ", ""),
		Name:  customError.NewCustomError("errorServer").Code,
		Ok:    false,
	})
}

func ResponseInternalServerError(c echo.Context, err string) error {
	return c.JSON(http.StatusBadRequest, types.ErrorResponse{
		Error: customError.NewCustomError("invalidRequest").Code,
		Name:  err,
		Ok:    false,
	})
}

func ResponseSuccess(c echo.Context, message string, data interface{}) error {
	return c.JSON(http.StatusOK,
		types.SuccessResponse{
			Ok:      true,
			Message: message,
			Data:    data,
		})
}

func ResponseCreated(c echo.Context) error {
	return c.JSON(http.StatusCreated,
		types.MsgResponse{
			Ok:      true,
			Message: "successfully created",
		})
}

func ResponseUpdated(c echo.Context) error {
	return c.JSON(http.StatusOK,
		types.MsgResponse{
			Ok:      true,
			Message: "successfully updated",
		})
}

func ResponseMsgSuccess(c echo.Context, message string) error {
	return c.JSON(http.StatusOK,
		types.MsgResponse{
			Ok:      true,
			Message: message,
		})
}
