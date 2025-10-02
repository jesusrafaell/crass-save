package handlers

import (
	codeError "crashsaver/photos/errorCodes"
	"crashsaver/photos/types"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

func ResponseCodeError(c echo.Context, err *codeError.CustomError) error {
	return c.JSON(http.StatusBadRequest, types.ErrorResponse{
		Error: err.Code,
		Name:  err.Name,
		Ok:    false,
	})
}

func ResponseBadRequest(c echo.Context, err string) error {
	return c.JSON(http.StatusBadRequest, types.ErrorResponse{
		Error: strings.ReplaceAll(err, " ", ""),
		Name:  codeError.NewCustomError("errorServer").Code,
		Ok:    false,
	})
}

func ResponseInternalServerError(c echo.Context, err string) error {
	return c.JSON(http.StatusBadRequest, types.ErrorResponse{
		Error: codeError.NewCustomError("invalidRequest").Code,
		Name:  err,
		Ok:    false,
	})
}

func ResponseSuccess(c echo.Context, message string, data interface{}) error {
	return c.JSON(http.StatusOK,
		types.SuccessResponse{
			Message: message,
			Data:    data,
			Ok:      true,
		})
}

func ResponseCreated(c echo.Context, message string) error {
	return c.JSON(http.StatusCreated,
		types.CreatedResponse{
			Message: message,
			Ok:      true,
		})
}
